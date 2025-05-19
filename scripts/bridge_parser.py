import pymupdf
import json
import os
import re

def extract_pdf_text(pdf_path):
    page_texts = []
    livret = pdf_path
    with open(pdf_path, "rb") as pdf_file:
        for page in pymupdf.open(pdf_file):
            page_texts.append(page.get_text())
    return page_texts, livret

starts = {
    "^D+ONNE" : "1",
    
    "^Est donneur" : "2",
    "^Ouest donneur" : "2",
    "^Nord donneur" : "2",
    "^Sud donneur" : "2",
    
    "^Est\\s*$" : "3",
    "^Ouest\\s*$" : "3",
    "^Nord\\s*$" : "3",
    "^Sud\\s*$" : "3",
    
    "^N\\s*$" : "4",
    
    "^Entame\\s*:" : "5",
    
    "^Enchères\\s*:" : "6",
    
    "^N-S\\s*$" : "7"
}

def create_text_blocks(page_text):
    current_value = "XXX"
    blocs = {}
    for line in page_text.splitlines():
        for regex, value in starts.items():
            match = re.match(regex, line)
            if match:
                current_value = value
                break
        if current_value not in blocs:
            blocs[current_value] = []
        blocs[current_value].append(line.strip())
            
    return blocs

def parse_blocs(blocs):
    return {
        "Donne N°": int(blocs["1"][0].split()[1]),
        "Donneur": blocs["2"][0].split()[0],
        "Encheres": parse_bids(blocs["3"], blocs["2"][0].split()[0]),
        "Cartes": parse_cards(blocs["4"]),
        "Entame": parse_entame(blocs["5"][0]),
    }

def parse_entame(line):
    icon = {"Pique": "♠", "Cœur": "♥", "Carreau": "♦", "Trèfle": "♣"}
    s = line.split()
    ret = s[2][0]
    if ret == "1":
        ret = "10"
    ret += icon[s[4]]
    return ret

def parse_bids(lines, dealer):
    bids = {"Sud": [], "Ouest": [], "Nord": [], "Est": []}
    next = {"Sud": "Ouest", "Ouest": "Nord", "Nord": "Est", "Est": "Sud"}
    key = ""
    for line in lines:
        if ' ' in line:
            break
        if line in bids.keys():
            key = line
        else:
            bids[key].append(line)
    ret = []
    while len(bids[dealer]) > 0:
        ret.append(bids[dealer].pop(0))
        dealer = next[dealer]
    if sum(len(bids[key]) for key in bids.keys()) > 0:
        raise ValueError("Bids not complete")
    return ret

def parse_cards(lines):
    c = [[] for _ in range(4)]
    index = 0
    current = 0
    while current < 4:
        while lines[index] == "N" or lines[index] == "♠":
            index += 4
        c[current].append(lines[index])
        c[current].append(lines[index+1])
        c[current].append(lines[index+2])
        c[current].append(lines[index+3])
        index += 4
        current += 1
    if sum(sum(len(c[i][j].split()) for j in range(4)) for i in range(4)) != 52:
        raise ValueError("Cards not complete")
    return {"Nord": c[0], "Est": c[1], "Ouest": c[2], "Sud": c[3]}

def build_database(page_texts):
    database = []
    for i, page_text in enumerate(page_texts):
        try:
            blocs = create_text_blocks(page_text)
            if len(blocs) != 7 or "XXX" in blocs:
                if i not in [0, 1, 26, 27]:
                    raise ValueError(blocs.keys())
                continue
            deal = parse_blocs(blocs)
            if deal and "Donne N°" in deal: 
                database.append(deal)
            else:
                raise ValueError(deal.keys())
        except Exception as e:
            print(f"\tError in page {i} : {e}")
    return database

if __name__ == "__main__":
    final_database = {}
    output_path = os.path.join("json", "deals.json")
    for pdf in os.listdir("pdfs"):
        if pdf.endswith(".pdf"):
            try:
                print(f"Processing {pdf}")
                pdf_file = os.path.join("pdfs", pdf)
                page_texts, title = extract_pdf_text(pdf_path=pdf_file)
                final_database[title] = build_database(page_texts)
            except Exception as e:
                print(f"Error processing {pdf}: {e}")
    with open(output_path, "w", encoding="utf-8") as outfile:
        json.dump(final_database, outfile, ensure_ascii=False, indent=2)
