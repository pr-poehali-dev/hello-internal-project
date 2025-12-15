import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const AUTH_API = 'https://functions.poehali.dev/8eb54989-2fe2-4b89-a4c2-43a30fc47c58';
const BOT_USERNAME = 'King_zov_loder_bot';

export default function Index() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const handlePhoneLogin = async () => {
    if (!phone) {
      toast({
        title: 'Ошибка',
        description: 'Введите номер телефона',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${data.user.first_name}!`,
        });
      } else {
        toast({
          title: 'Ошибка входа',
          description: 'Пользователь не найден. Зарегистрируйтесь через Telegram бот.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить вход',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramLogin = () => {
    window.open(`https://t.me/${BOT_USERNAME}`, '_blank');
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
              onClick={() => setUser(null)}
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
            <Icon name="LogIn" size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
          <CardDescription>Выберите способ авторизации</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Регистрация</TabsTrigger>
              <TabsTrigger value="login">Вход</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="space-y-4 mt-4">
              <div className="space-y-3">
                <Button
                  onClick={handleTelegramLogin}
                  className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white"
                  size="lg"
                >
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Зарегистрироваться через Telegram
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Нажмите для открытия бота и отправьте свой контакт
                </p>
              </div>
            </TabsContent>

            <TabsContent value="login" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Номер телефона
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 999 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button
                  onClick={handlePhoneLogin}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Вход...
                    </>
                  ) : (
                    <>
                      <Icon name="LogIn" size={20} className="mr-2" />
                      Войти
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">или</span>
                  </div>
                </div>

                <Button
                  onClick={handleTelegramLogin}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Войти через Telegram
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}