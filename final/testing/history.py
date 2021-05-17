import json
import urllib.request

key = "5b5a9f1f4b08e4183144f47a363fb3465960a7b5"
path = "https://api.nomics.com/v1/exchange-rates/history?"

coin = "ETH"
start = "2021-05-13T00%3A00%3A00Z"
end = "2021-05-14T00%3A00%3A00Z"

url = f"{path}key={key}&currency={coin}&start={start}"

resp = urllib.request.urlopen(url).read().decode("utf-8")

data = json.loads(resp)

for i in data:
	date = i["timestamp"][:-4].split("T")
	rate = round(float(i["rate"]), 2)
	print(f"{date[0]} {date[1]} - ${rate}")