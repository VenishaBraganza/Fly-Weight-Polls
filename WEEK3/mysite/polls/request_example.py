import requests

url = 'http://localhost:8000/polls/goat_footballer/'
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f'Error: {response.status_code} - {response.text}')