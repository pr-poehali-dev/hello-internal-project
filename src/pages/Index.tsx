import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Icon name="UserCheck" size={32} className="text-primary" />
            </div>
            <CardTitle className="text-2xl">Вы вошли в систему</CardTitle>
            <CardDescription>Добро пожаловать!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="User" size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Phone" size={18} className="text-muted-foreground" />
                <p className="text-sm">{user.phone}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Выйти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Icon name="UserPlus" size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>Зарегистрируйтесь через Telegram бота</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleTelegramRegister}
              className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white"
              size="lg"
            >
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Открыть Telegram бота
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Нажмите кнопку выше, чтобы открыть бота.<br />
              Отправьте боту свой контакт для регистрации.
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <p className="text-xs text-muted-foreground">
                После отправки контакта вы автоматически будете зарегистрированы в системе
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}