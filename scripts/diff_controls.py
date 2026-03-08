from bs4 import BeautifulSoup

def summarize_controls(filepath):
    print(f"\n--- {filepath} ---")
    with open(filepath, 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    controls = soup.find('aside', class_='controls')
    if not controls:
        print("No .controls found")
        return
        
    for tag in controls.find_all(recursive=False):
        if tag.name in ['h2', 'h3']:
            print(tag)
        elif tag.name == 'div':
            classes = tag.get('class', [])
            print(f"div.{'.'.join(classes)}")
            # print inputs inside
            inputs = tag.find_all(['input', 'select', 'button'])
            for i in inputs:
                if i.name == 'input':
                    print(f"  input type={i.get('type')} id={i.get('id')}")
                else:
                    print(f"  {i.name} id={i.get('id', '')} class={i.get('class', '')}")
            
summarize_controls('ATS_Executive.html')
summarize_controls('Classic_Minimal.html')
summarize_controls('Modern_Sidebar.html')
summarize_controls('Premium_Headshot.html')

