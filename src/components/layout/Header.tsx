
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import UserCategoryBadge from "@/components/user/UserCategoryBadge";
import LocationButton from "@/components/location/LocationButton";
import WalletBalance from "@/components/wallet/WalletBalance";

const Header = () => {
  const { user } = useAuth();
  const { balance } = useWallet();

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="renaissance-container py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Groups</h1>
            {user?.location && (
              <LocationButton city={user.location.city} />
            )}
          </div>

          <div className="flex items-center space-x-3">
            {user?.user_category && (
              <UserCategoryBadge category={user.user_category} />
            )}
            <WalletBalance balance={balance} />
            {user && <NotificationCenter />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
