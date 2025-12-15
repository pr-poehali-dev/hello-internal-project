import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import Dashboard from './Dashboard';

const AUTH_API = 'https://functions.poehali.dev/8eb54989-2fe2-4b89-a4c2-43a30fc47c58';
const SETUP_WEBHOOK_API = 'https://functions.poehali.dev/ea046f09-368a-4e9d-b86d-21ec84e9b13e';
const BOT_USERNAME = 'King_zov_loder_bot';

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [webhookSetup, setWebhookSetup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const setupWebhook = async () => {
      try {
        const response = await fetch(SETUP_WEBHOOK_API, {
          method: 'POST',
        });
        const data = await response.json();
        if (data.success) {
          setWebhookSetup(true);
        }
      } catch (error) {
        console.error('Failed to setup webhook:', error);
      }
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setupWebhook();
  }, []);

  const handleTelegramRegister = () => {
    window.open(`https://t.me/${BOT_USERNAME}`, '_blank');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-rose-100 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl animate-fade-in border-red-200 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
            <Icon name="UserPlus" size={36} className="text-white" />
          </div>
          <CardTitle className="text-3xl text-red-900 font-bold">Регистрация</CardTitle>
          <CardDescription className="text-red-600">Зарегистрируйтесь через Telegram бота</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleTelegramRegister}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg h-12"
              size="lg"
            >
              <Icon name="MessageCircle" size={22} className="mr-2" />
              Открыть Telegram бота
            </Button>
            <p className="text-sm text-red-700 text-center leading-relaxed">
              Нажмите кнопку выше, чтобы открыть бота.<br />
              Отправьте боту свой контакт для регистрации.
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Icon name="Sparkles" size={18} className="text-amber-600 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                После отправки контакта вы автоматически будете зарегистрированы в системе
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}