from bs4 import BeautifulSoup

def print_controls(filepath):
    print(f"\n--- {filepath} ---")
    with open(filepath, 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    controls = soup.find('aside', class_='controls')
    # Print the first 500 characters of the inner HTML to see the structure
    if controls:
        print(str(controls)[:800])
    else:
        print("No .controls found")

print_controls("ATS_Executive.html")
print_controls("Classic_Minimal.html")

