import json
import os
import psycopg2
from typing import Dict, Any
from urllib.request import urlopen, Request
from urllib.error import HTTPError

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Telegram бот для регистрации пользователей через контакт
    Args: event - запрос от Telegram webhook
          context - контекст выполнения функции
    Returns: HTTP ответ для Telegram
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Bot token not configured'}),
            'isBase64Encoded': False
        }
    
    update = json.loads(event.get('body', '{}'))
    
    if 'message' not in update:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True}),
            'isBase64Encoded': False
        }
    
    message = update['message']
    chat_id = message['chat']['id']
    
    if message.get('contact'):
        contact = message['contact']
        phone = contact.get('phone_number')
        user_id = contact.get('user_id')
        first_name = contact.get('first_name', '')
        last_name = contact.get('last_name', '')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute(
            "INSERT INTO users (telegram_id, phone_number, first_name, last_name) VALUES (%s, %s, %s, %s) ON CONFLICT (telegram_id) DO UPDATE SET phone_number = EXCLUDED.phone_number, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name RETURNING id",
            (user_id, phone, first_name, last_name)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        send_telegram_message(bot_token, chat_id, '✅ Вы успешно зарегистрированы! Теперь можете войти на сайт.')
    
    elif message.get('text') == '/start':
        keyboard = {
            'keyboard': [[{
                'text': '📱 Отправить контакт',
                'request_contact': True
            }]],
            'resize_keyboard': True,
            'one_time_keyboard': True
        }
        send_telegram_message(bot_token, chat_id, 'Привет! Отправьте свой контакт для регистрации:', keyboard)
    
    else:
        send_telegram_message(bot_token, chat_id, 'Пожалуйста, нажмите кнопку "📱 Отправить контакт" для регистрации.')
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True}),
        'isBase64Encoded': False
    }

def send_telegram_message(token: str, chat_id: int, text: str, reply_markup: Dict = None):
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    data = {
        'chat_id': chat_id,
        'text': text
    }
    if reply_markup:
        data['reply_markup'] = reply_markup
    
    req = Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urlopen(req) as response:
            response.read()
    except HTTPError:
        pass
