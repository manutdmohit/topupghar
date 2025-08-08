'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Loader2,
  Send,
  MessageCircle,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function TelegramTestPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const testTelegram = async (testType: string) => {
    setLoading(testType);
    try {
      const response = await fetch('/api/test-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Test ${testType} sent successfully!`);
      } else {
        toast.error(data.message || 'Failed to send test');
      }
    } catch (error) {
      toast.error('Error sending test to Telegram');
      console.error('Telegram test error:', error);
    } finally {
      setLoading(null);
    }
  };

  const testTypes = [
    {
      id: 'payment',
      title: 'Payment Notification',
      description: 'Test sending detailed payment information to Telegram',
      icon: <Send className="w-5 h-5" />,
      color: 'bg-blue-500',
    },
    {
      id: 'simple',
      title: 'Simple Notification',
      description: 'Test sending a simple text message to Telegram',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-500',
    },
    {
      id: 'status',
      title: 'Status Update',
      description: 'Test sending order status update to Telegram',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Telegram Bot Test Dashboard
          </h1>
          <p className="text-gray-600">
            Test your Telegram bot integration with different types of
            notifications
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testTypes.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${test.color} text-white`}>
                    {test.icon}
                  </div>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                </div>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => testTelegram(test.id)}
                  disabled={loading === test.id}
                  className="w-full"
                  variant="outline"
                >
                  {loading === test.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Test
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span>Important Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                • Make sure your{' '}
                <code className="bg-gray-100 px-1 rounded">
                  TELEGRAM_BOT_TOKEN
                </code>{' '}
                and{' '}
                <code className="bg-gray-100 px-1 rounded">
                  TELEGRAM_GROUP_ID
                </code>{' '}
                are set in your environment variables.
              </p>
              <p>
                • The bot must be added to your Telegram channel/group as an
                admin with permission to send messages.
              </p>
              <p>
                • Check your Telegram channel/group to see if the test messages
                are received.
              </p>
              <p>
                • If tests fail, check the browser console and server logs for
                error details.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Environment Variables Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  TELEGRAM_BOT_TOKEN
                </code>
                <span className="text-sm text-gray-500">
                  Your Telegram bot token from @BotFather
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  TELEGRAM_CHAT_ID
                </code>
                <span className="text-sm text-gray-500">
                  Your personal chat ID (positive number)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  TELEGRAM_GROUP_ID
                </code>
                <span className="text-sm text-gray-500">
                  Your Telegram channel/group ID (e.g., -1001234567890)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
