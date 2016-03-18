import requests
from bs4 import BeautifulSoup
import lxml
import time
import datetime
from pytz import timezone

def main():
	items_json = []
	for i in range(1, 4):
		res = requests.get("http://www.hkepc.com/forum/forumdisplay.php?fid=14&page=" + str(i))
		soup = BeautifulSoup(res.text,'lxml')
		rows = soup.findAll('tbody')
		#print res.url
		for row in rows:
			rowSoup = BeautifulSoup(str(row), 'lxml')
			aTag = BeautifulSoup(str(rowSoup), 'lxml').findAll('a')
			if(  BeautifulSoup(str(rowSoup), 'lxml').find('th', {'class': 'subject common'}) 
				or BeautifulSoup(str(rowSoup), 'lxml').find('th', {'class': 'subject new'})
			):
				if( len(aTag) > 2):
					catalog = aTag[1].get_text()
					item = aTag[2].get_text()
					editInfo = rowSoup.find('td', {'class': 'author'})
					author = BeautifulSoup(str(editInfo), 'lxml').find('a').get_text()
					date = BeautifulSoup(str(editInfo), 'lxml').find('em').get_text()
                                        last = rowSoup.find('td', {'class': 'lastpost'}).find('em').find('a').find('span').get('title')
					url = aTag[2].get('href')
					#print (catalog + ':' + item + ':' + author + ':'  + date)	
					tmp = {'catalog':catalog, 'item':item, 'author':author, 'date':date, 'url':url, 'last':last}
					items_json.append(tmp)			
	return ('ok', items_json, datetime.datetime.now(timezone('Asia/Hong_Kong'))
)
