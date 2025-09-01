import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Wallet, Phone, Mail, Plus, Minus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet_balance: number;
}

interface UserCardProps {
  user: User;
  onUpdateWallet: (userId: string, amount: number) => void;
}

export const UserCard = ({ user, onUpdateWallet }: UserCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "success";
    if (balance < 0) return "destructive";
    return "secondary";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
          </div>
          <Badge variant={getBalanceColor(user.wallet_balance)} className="font-semibold">
            <Wallet className="w-3 h-3 mr-1" />
            {formatCurrency(user.wallet_balance)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="w-4 h-4 mr-2" />
            {user.email}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="w-4 h-4 mr-2" />
            {user.phone}
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onUpdateWallet(user.id, 100)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add $100
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onUpdateWallet(user.id, -50)}
          >
            <Minus className="w-3 h-3 mr-1" />
            Deduct $50
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};