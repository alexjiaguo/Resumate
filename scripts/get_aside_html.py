from bs4 import BeautifulSoup
import sys

def get_aside(filepath):
    print(f"\n================ {filepath} ================\n")
    with open(filepath, 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')
    controls = soup.find('aside', class_='controls')
    print(controls.prettify() if controls else "No .controls")

get_aside('ATS_Executive.html')
get_aside('Classic_Minimal.html')
get_aside('Modern_Sidebar.html')
get_aside('Premium_Headshot.html')
