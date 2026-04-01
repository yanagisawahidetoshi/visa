import os
import json
import requests
import re
import time
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator

def get_country_metadata():
    print("Fetching country metadata from REST Countries API...")
    url = "https://restcountries.com/v3.1/all?fields=name,translations,region"
    resp = requests.get(url)
    data = resp.json()
    metadata = {}
    for c in data:
        eng_name = c.get('name', {}).get('common', '')
        ja_name = c.get('translations', {}).get('jpn', {}).get('common', eng_name)
        region = c.get('region', 'Unknown')
        
        aliases = [eng_name, c.get('name', {}).get('official', '')]
        for a in aliases:
            if a:
                metadata[a.lower()] = {
                    "ja_name": ja_name,
                    "region": region
                }
    
    # manual patches for wikipedia names
    metadata["côte d'ivoire"] = metadata.get("ivory coast", {"ja_name": "コートジボワール", "region": "Africa"})
    metadata["são tomé and príncipe"] = metadata.get("sao tome and principe", {"ja_name": "サントメ・プリンシペ", "region": "Africa"})
    metadata["gambia"] = metadata.get("the gambia", {"ja_name": "ガンビア", "region": "Africa"})
    metadata["bahamas"] = metadata.get("the bahamas", {"ja_name": "バハマ", "region": "Americas"})
    metadata["echineast"] = {"ja_name": "エスワティニ", "region": "Africa"} # Just in case
    metadata["eswatini"] = metadata.get("eswatini", {"ja_name": "エスワティニ", "region": "Africa"})
    metadata["united kingdom"] = {"ja_name": "イギリス", "region": "Europe"}
    metadata["united states"] = {"ja_name": "アメリカ", "region": "Americas"}
    
    return metadata

def parse_visa_categories(req_text):
    text_lower = req_text.lower()
    if "visa not required" in text_lower or "freedom of movement" in text_lower or "visa free" in text_lower:
        return "ビザ不要"
    elif "evisa" in text_lower or "e-visa" in text_lower or "electronic travel authorization" in text_lower or "esta" in text_lower or "eta" in text_lower:
        return "E-Visa"
    elif "visa on arrival" in text_lower:
        return "OAV (到着ビザ)"
    elif "visa required" in text_lower or "admission refused" in text_lower:
        return "大使館"
    else:
        if "on arrival" in text_lower or "e-visa" in text_lower:
            return "E-Visa / OAV"
        return "それ以外"

def scrape_wikipedia():
    url = "https://en.wikipedia.org/wiki/Visa_requirements_for_Japanese_citizens"
    print(f"Scraping {url}...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    tables = soup.find_all('table', {'class': 'sortable'})
    if not tables:
        print("Could not find any sortable table!")
        return []
    
    visa_table = tables[0]
    rows = visa_table.find('tbody').find_all('tr')
    
    metadata = get_country_metadata()
    countries_data = []

    for row in rows:
        cols = row.find_all(['td', 'th'])
        if len(cols) >= 3:
            country_name = cols[0].text.strip().replace('*', '').replace('~', '')
            visa_req_text = cols[1].text.strip()
            
            notes_text = ""
            for i in range(2, len(cols)):
                notes_text += cols[i].text.strip() + " "
            notes_text = notes_text.strip()

            visa_req_text = re.sub(r'\[.*?\]', '', visa_req_text)
            notes_text = re.sub(r'\[.*?\]', '', notes_text)
            category = parse_visa_categories(visa_req_text)
            
            notes_ja = notes_text
            if len(notes_text) > 2:
                try:
                    notes_ja = GoogleTranslator(source='en', target='ja').translate(notes_text)
                    time.sleep(0.5)
                except Exception as e:
                    print(f"Translation failed for {country_name}: {e}")
            
            lookup = country_name.lower().strip()
            if "united states" in lookup: lookup = "united states"
            if "congo" in lookup and "democratic" in lookup: lookup = "dr congo"
            
            meta = metadata.get(lookup, {})
            if not meta:
                for k, v in metadata.items():
                    if lookup in k or k in lookup:
                        meta = v
                        break

            ja_name = meta.get("ja_name", country_name)
            region = meta.get("region", "Unknown")

            if country_name and "Country" not in country_name and len(country_name) > 2:
                countries_data.append({
                    "countryEng": country_name,
                    "countryJa": ja_name,
                    "region": region,
                    "statusRaw": visa_req_text,
                    "category": category,
                    "notes": notes_ja
                })

    return countries_data

if __name__ == "__main__":
    data = scrape_wikipedia()
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "visas.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully scraped {len(data)} countries and saved to {out_file}")
