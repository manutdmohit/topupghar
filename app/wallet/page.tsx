'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WalletTopup from '@/components/wallet/WalletTopup';
import WalletBalance from '@/components/wallet/WalletBalance';
import { Wallet, CreditCard, History } from 'lucide-react';

export default function WalletPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('balance');

  // Check for tab parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab && ['balance', 'topup', 'history'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Wallet className="w-20 h-20 mx-auto text-gray-400 mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              My Wallet
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 px-4">
              Access your wallet to top up funds and view transaction history
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Login to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Wallet
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Manage your wallet balance and top up funds for quick payments
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 sm:space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-sm sm:max-w-md mx-auto h-auto p-1">
              <TabsTrigger
                value="balance"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3"
              >
                <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Balance</span>
                <span className="sm:hidden">Bal</span>
              </TabsTrigger>
              <TabsTrigger
                value="topup"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3"
              >
                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Top Up</span>
                <span className="sm:hidden">Top</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">History</span>
                <span className="sm:hidden">Hist</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="balance" className="space-y-4 sm:space-y-6">
              <WalletBalance />
            </TabsContent>

            <TabsContent value="topup" className="space-y-4 sm:space-y-6">
              <div className="max-w-4xl mx-auto">
                <WalletTopup />
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <History className="w-5 h-5" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WalletBalance />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Info Section */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg sm:text-xl">
                How Wallet Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      1
                    </span>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                    Top Up
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-800 px-2">
                    Add funds to your wallet using various payment methods like
                    eSewa, Khalti, or bank transfer
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      2
                    </span>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                    Admin Verification
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-800 px-2">
                    Our admin team verifies your payment receipt and approves
                    the topup within 24 hours
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      3
                    </span>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                    Quick Payments
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-800 px-2">
                    Use your wallet balance to pay for orders instantly without
                    waiting for payment verification
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
