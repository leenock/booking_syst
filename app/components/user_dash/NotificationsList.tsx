import { Bell, Calendar, Tag, Info } from 'lucide-react';

export default function NotificationsList() {
  const notifications = [
    {
      id: 1,
      type: 'promo',
      title: 'Special Weekend Offer!',
      message: 'Get 20% off on Deluxe rooms this weekend.',
      date: '2024-03-15 09:30',
      isRead: false,
      icon: Tag,
      color: 'text-pink-600 bg-pink-100',
    },
    {
      id: 2,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking for Deluxe Room has been confirmed.',
      date: '2024-03-14 15:45',
      isRead: true,
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      id: 3,
      type: 'info',
      title: 'New Features Available',
      message: 'Check out our new room service menu.',
      date: '2024-03-13 11:20',
      isRead: false,
      icon: Info,
      color: 'text-blue-600 bg-blue-100',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              bg-white rounded-xl shadow-sm p-4 transition-all duration-200
              hover:shadow-md relative
              ${notification.isRead ? 'opacity-75' : ''}
            `}
          >
            {/* Unread Indicator */}
            {!notification.isRead && (
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full"></div>
            )}

            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${notification.color}`}>
                <notification.icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center space-x-4 border-t pt-4">
              <button className="text-sm text-gray-600 hover:text-purple-600">
                Mark as {notification.isRead ? 'unread' : 'read'}
              </button>
              <button className="text-sm text-red-600 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 