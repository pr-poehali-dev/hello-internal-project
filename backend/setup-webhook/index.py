import json
import os
from typing import Dict, Any
from urllib.request import urlopen, Request
from urllib.error import HTTPError

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Настройка webhook для Telegram бота
    Args: event - HTTP запрос
          context - контекст выполнения
    Returns: результат настройки webhook
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Bot token not configured'}),
            'isBase64Encoded': False
        }
    
    webhook_url = 'https://functions.poehali.dev/a6beed40-a2ad-4bdf-af37-28bfb287fb19'
    
    if method == 'POST':
        url = f'https://api.telegram.org/bot{bot_token}/setWebhook'
        data = {'url': webhook_url}
        
        req = Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
        try:
            with urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': 'Webhook установлен',
                        'webhook_url': webhook_url,
                        'telegram_response': result
                    }),
                    'isBase64Encoded': False
                }
        except HTTPError as e:
            error_body = e.read().decode('utf-8')
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Failed to set webhook: {error_body}'}),
                'isBase64Encoded': False
            }
    
    if method == 'GET':
        url = f'https://api.telegram.org/bot{bot_token}/getWebhookInfo'
        
        req = Request(url)
        try:
            with urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
        except HTTPError as e:
            error_body = e.read().decode('utf-8')
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Failed to get webhook info: {error_body}'}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
