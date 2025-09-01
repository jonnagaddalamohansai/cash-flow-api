import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCard } from "@/components/UserCard";
import { TransactionTable } from "@/components/TransactionTable";
import { WalletUpdateModal } from "@/components/WalletUpdateModal";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Search,
  RefreshCw,
  Plus
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet_balance: number;
}

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        wallet_balance: 1250.00
      },
      {
        id: "2", 
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 (555) 987-6543",
        wallet_balance: 750.50
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com", 
        phone: "+1 (555) 456-7890",
        wallet_balance: -125.25
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: "1",
        user_id: "1",
        amount: 100.00,
        transaction_type: 'credit',
        description: "Wallet top-up",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        user_id: "2",
        amount: -50.00,
        transaction_type: 'debit', 
        description: "Payment for service",
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    setUsers(mockUsers);
    setTransactions(mockTransactions);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userTransactions = selectedUserId 
    ? transactions.filter(t => t.user_id === selectedUserId)
    : transactions;

  const totalWalletBalance = users.reduce((sum, user) => sum + user.wallet_balance, 0);
  const totalUsers = users.length;
  const totalTransactions = transactions.length;

  const handleUpdateWallet = async (userId: string, amount: number, description?: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, wallet_balance: user.wallet_balance + amount }
          : user
      ));

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        user_id: userId,
        amount: amount,
        transaction_type: amount > 0 ? 'credit' : 'debit',
        description: description || (amount > 0 ? 'Wallet credit' : 'Wallet debit'),
        created_at: new Date().toISOString()
      };

      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Wallet Updated",
        description: `Successfully ${amount > 0 ? 'added' : 'deducted'} $${Math.abs(amount)}`,
      });
      
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cash Flow Dashboard</h1>
          <p className="text-muted-foreground">Manage user wallets and track transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalWalletBalance)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onUpdateWallet={(userId, amount) => handleUpdateWallet(userId, amount)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Transaction Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Transactions Table */}
            <TransactionTable 
              transactions={userTransactions}
              title={selectedUserId ? `Transactions for ${users.find(u => u.id === selectedUserId)?.name}` : "All Transactions"}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
