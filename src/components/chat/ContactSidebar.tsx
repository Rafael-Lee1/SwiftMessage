import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Users, Phone, Video, Calendar, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample contact data with Brazilian names
const contacts = [
  { id: 1, name: 'João Silva', avatar: '/lovable-uploads/551d19b2-4705-4bf3-86ff-0725079998cf.png', lastMessage: 'Can you please check the latest design?', online: true, unread: 0 },
  { id: 2, name: 'Thiago Oliveira', avatar: '', lastMessage: 'Let me know when you\'re free', online: true, unread: 3 },
  { id: 3, name: 'Rafael Souza', avatar: '', lastMessage: 'Meeting scheduled at 3 PM', online: true, unread: 0 },
  { id: 4, name: 'Bruno Costa', avatar: '', lastMessage: 'Thanks for the update!', online: false, unread: 0 },
  { id: 5, name: 'Pedro Santos', avatar: '', lastMessage: 'Looking forward to collaborate', online: false, unread: 0 },
  { id: 6, name: 'Marcos Ferreira', avatar: '', lastMessage: 'Project deadline is tomorrow', online: true, unread: 2 },
  { id: 7, name: 'Gabriel Almeida', avatar: '', lastMessage: 'Could you review my PR?', online: false, unread: 0 },
  { id: 8, name: 'Lucas Pereira', avatar: '', lastMessage: 'Great work on the presentation!', online: false, unread: 0 },
];

const ContactSidebar = () => {
  const [selectedContact, setSelectedContact] = useState(3); // Abu Abdullah Nugraha
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 bg-gray-100 dark:bg-gray-700 border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          className={`flex-1 rounded-none ${activeTab === 'chat' ? 'bg-primary text-primary-foreground' : 'text-gray-700 dark:text-gray-300'}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </Button>
        <Button
          variant={activeTab === 'groups' ? 'default' : 'ghost'}
          className={`flex-1 rounded-none ${activeTab === 'groups' ? 'bg-primary text-primary-foreground' : 'text-gray-700 dark:text-gray-300'}`}
          onClick={() => setActiveTab('groups')}
        >
          <Users className="h-4 w-4 mr-2" />
          Groups
        </Button>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 relative ${
              selectedContact === contact.id ? 'contact-active' : ''
            }`}
            onClick={() => setSelectedContact(contact.id)}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
              </Avatar>
              {contact.online && (
                <span className="contact-status-online absolute bottom-0 right-0 ring-2 ring-white dark:ring-gray-800"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="font-medium text-sm truncate text-gray-800 dark:text-gray-200">{contact.name}</span>
                {contact.unread > 0 && (
                  <Badge variant="default" className="bg-primary h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {contact.unread}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around p-2 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <Calendar className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ContactSidebar;
