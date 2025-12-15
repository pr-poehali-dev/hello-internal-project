import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface DashboardProps {
  user: {
    id: number;
    telegram_id: number;
    phone: string;
    first_name: string;
    last_name: string;
    username?: string;
    balance?: number;
    bonus_balance?: number;
  };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'settings'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const balance = user.balance || 0;
  const bonusBalance = user.bonus_balance || 0;
  const username = user.username || user.first_name || 'Пользователь';

  const closeMenu = () => setIsMenuOpen(false);

  const navigateTo = (page: 'home' | 'profile' | 'settings') => {
    setCurrentPage(page);
    closeMenu();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-amber-50">
      {currentPage === 'home' && (
        <div className="min-h-screen">
          <header className="bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-600">
                      <Icon name="Menu" size={24} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 bg-gradient-to-b from-red-50 to-rose-50">
                    <div className="py-6 space-y-6">
                      <div className="px-3 space-y-1">
                        <h3 className="text-sm font-semibold text-red-900">Меню</h3>
                      </div>
                      <nav className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-700 hover:bg-red-100 hover:text-red-900"
                          onClick={() => navigateTo('profile')}
                        >
                          <Icon name="User" size={20} className="mr-3" />
                          Мой профиль
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-700 hover:bg-red-100 hover:text-red-900"
                          onClick={() => navigateTo('settings')}
                        >
                          <Icon name="Settings" size={20} className="mr-3" />
                          Настройки
                        </Button>
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
                <span className="font-semibold text-red-900">{username}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Пополнить
                </Button>
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-red-100">
                  <Icon name="Wallet" size={18} className="text-amber-600" />
                  <span className="font-bold text-red-900">{balance.toFixed(2)} ₽</span>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid gap-6">
              <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-none shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm mb-1">Основной баланс</p>
                      <p className="text-4xl font-bold">{balance.toFixed(2)} ₽</p>
                    </div>
                    <Icon name="TrendingUp" size={48} className="text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="Gift" size={24} className="text-amber-600" />
                      <h3 className="font-semibold text-red-900">Бонусный баланс</h3>
                    </div>
                    <p className="text-2xl font-bold text-red-700">{bonusBalance.toFixed(2)} ₽</p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="Clock" size={24} className="text-amber-600" />
                      <h3 className="font-semibold text-red-900">Последняя активность</h3>
                    </div>
                    <p className="text-sm text-red-600">Только что</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="min-h-screen">
          <header className="bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentPage('home')}
                className="text-red-600"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-red-900">Мой профиль</h1>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-8">
            <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="User" size={40} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-900">{username}</h2>
                  <p className="text-red-600">{user.phone}</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-red-100">
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4">
                    <p className="text-sm text-red-700 mb-1">Основной баланс</p>
                    <p className="text-3xl font-bold text-red-900">{balance.toFixed(2)} ₽</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-red-600 hover:bg-red-700 text-white h-12">
                      <Icon name="Plus" size={20} className="mr-2" />
                      Пополнить
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white h-12">
                      <Icon name="ArrowUpRight" size={20} className="mr-2" />
                      Вывести
                    </Button>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Gift" size={20} className="text-amber-600" />
                      <p className="text-sm font-medium text-amber-900">Бонусный баланс</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">{bonusBalance.toFixed(2)} ₽</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      )}

      {currentPage === 'settings' && (
        <div className="min-h-screen">
          <header className="bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentPage('home')}
                className="text-red-600"
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-xl font-bold text-red-900">Настройки</h1>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-8">
            <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Личные данные</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-red-700 block mb-1">Имя</label>
                      <input
                        type="text"
                        defaultValue={user.first_name}
                        className="w-full px-4 py-2 rounded-lg border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-red-700 block mb-1">Фамилия</label>
                      <input
                        type="text"
                        defaultValue={user.last_name}
                        className="w-full px-4 py-2 rounded-lg border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-red-700 block mb-1">Отчество</label>
                      <input
                        type="text"
                        placeholder="Не указано"
                        className="w-full px-4 py-2 rounded-lg border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-red-700 block mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="example@mail.ru"
                        className="w-full px-4 py-2 rounded-lg border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-red-700 block mb-1">Телефон</label>
                      <input
                        type="tel"
                        defaultValue={user.phone}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-red-100">
                  <Button
                    onClick={onLogout}
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <Icon name="LogOut" size={20} className="mr-2" />
                    Выйти из аккаунта
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      )}
    </div>
  );
}
