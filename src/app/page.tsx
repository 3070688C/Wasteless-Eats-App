"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  BarChart3,
  Box,
  DollarSign,
  Edit,
  Gift,
  Home,
  Leaf,
  LogOut,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";

type UserType = "customer" | "business";
type AuthMode = "login" | "signup";
type TabKey =
  | "home"
  | "inventory"
  | "marketplace"
  | "packaging"
  | "rewards"
  | "analytics"
  | "settings";

type DemoAccount = {
  password: string;
  userType: UserType;
  name: string;
  businessId?: string;
};

type BusinessProfile = {
  storeName: string;
  location: string;
  packagingOptions: string[];
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  expiryDays: number;
  forecastDemand: string;
};

type ListingItem = {
  id: string;
  businessId: string;
  name: string;
  originalPrice: number;
  marketPrice: number;
  quantity: number;
  timeLeftHours: number;
  image: string;
};

type PackagingItem = {
  id: string;
  menuType: string;
  currentMaterial: string;
  suggestedMaterial: string;
  supplier: string;
  carbonReductionPct: number;
  costDelta: number;
  notes: string;
};

type RewardTier = {
  name: "Bronze" | "Silver" | "Gold";
  minPoints: number;
  color: string;
  benefits: string[];
};

const demoAccounts: Record<string, DemoAccount> = {
  "business@demo.com": {
    password: "demo123",
    userType: "business",
    name: "Marina Pantry",
    businessId: "biz-marina",
  },
  "customer@demo.com": {
    password: "demo123",
    userType: "customer",
    name: "Alicia Tan",
  },
};

const initialBusinessProfiles: Record<string, BusinessProfile> = {
  "biz-marina": {
    storeName: "Marina Pantry",
    location: "Marina Bay",
    packagingOptions: [
      "Bring your own container",
      "Compostable box",
      "Reusable deposit box",
    ],
  },
  "biz-kallang": {
    storeName: "Kallang Kitchen",
    location: "Kallang",
    packagingOptions: ["Bring your own container", "Compostable bowl", "Paper wrap"],
  },
  "biz-tiong": {
    storeName: "Tiong Bahru Cafe",
    location: "Tiong Bahru",
    packagingOptions: ["Bring your own container", "Paper sleeve", "Reusable cup"],
  },
  "biz-bugis": {
    storeName: "Bugis Bento Lab",
    location: "Bugis",
    packagingOptions: [
      "Bring your own container",
      "Compostable tray",
      "Returnable steel tiffin",
    ],
  },
  "biz-queenstown": {
    storeName: "Queenstown Greens",
    location: "Queenstown",
    packagingOptions: [
      "Bring your own container",
      "Banana leaf wrap",
      "Paper bowl",
    ],
  },
};

const tabs: Array<{ path: TabKey; label: string; icon: React.ReactNode; userTypes: UserType[] }> = [
  { path: "home", label: "Home", icon: <Home className="h-5 w-5" />, userTypes: ["business"] },
  {
    path: "inventory",
    label: "Inventory",
    icon: <Package className="h-5 w-5" />,
    userTypes: ["business"],
  },
  {
    path: "marketplace",
    label: "Market",
    icon: <ShoppingBag className="h-5 w-5" />,
    userTypes: ["customer", "business"],
  },
  {
    path: "packaging",
    label: "Packaging",
    icon: <Box className="h-5 w-5" />,
    userTypes: ["business"],
  },
  {
    path: "rewards",
    label: "Rewards",
    icon: <Gift className="h-5 w-5" />,
    userTypes: ["customer", "business"],
  },
  {
    path: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    userTypes: ["business"],
  },
  {
    path: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    userTypes: ["business"],
  },
];

const initialInventory: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Fresh Chicken",
    category: "Protein",
    quantity: 12,
    unit: "kg",
    minThreshold: 15,
    expiryDays: 2,
    forecastDemand: "High",
  },
  {
    id: "inv-2",
    name: "Mixed Greens",
    category: "Vegetables",
    quantity: 7,
    unit: "kg",
    minThreshold: 5,
    expiryDays: 1,
    forecastDemand: "Moderate",
  },
  {
    id: "inv-3",
    name: "Jasmine Rice",
    category: "Staples",
    quantity: 20,
    unit: "kg",
    minThreshold: 10,
    expiryDays: 30,
    forecastDemand: "Stable",
  },
];

const initialMarketplace: ListingItem[] = [
  {
    id: "mkt-1",
    businessId: "biz-marina",
    name: "Teriyaki Rice Bowl",
    originalPrice: 9.9,
    marketPrice: 5.9,
    quantity: 6,
    timeLeftHours: 2,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mkt-2",
    businessId: "biz-kallang",
    name: "Laksa Family Set",
    originalPrice: 18,
    marketPrice: 10.8,
    quantity: 3,
    timeLeftHours: 1.5,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mkt-3",
    businessId: "biz-tiong",
    name: "Cold Brew and Bakes",
    originalPrice: 14.5,
    marketPrice: 8.5,
    quantity: 5,
    timeLeftHours: 3,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mkt-4",
    businessId: "biz-marina",
    name: "Miso Salmon Bento",
    originalPrice: 16.9,
    marketPrice: 9.9,
    quantity: 4,
    timeLeftHours: 2.5,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mkt-5",
    businessId: "biz-bugis",
    name: "Chicken Rendang Wrap",
    originalPrice: 12.5,
    marketPrice: 7.5,
    quantity: 7,
    timeLeftHours: 1,
    image:
      "https://images.unsplash.com/photo-1565299585323-38174c4a6471?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mkt-6",
    businessId: "biz-queenstown",
    name: "Veggie Grain Bowl",
    originalPrice: 11.9,
    marketPrice: 6.9,
    quantity: 8,
    timeLeftHours: 3.5,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mkt-7",
    businessId: "biz-kallang",
    name: "Satay Rice Set",
    originalPrice: 13.8,
    marketPrice: 8.2,
    quantity: 5,
    timeLeftHours: 2,
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80",
  },
];

const packagingOptions: PackagingItem[] = [
  {
    id: "pkg-1",
    menuType: "Rice bowls",
    currentMaterial: "PP takeaway box",
    suggestedMaterial: "Bagasse clamshell with corn lid",
    supplier: "EcoPax Singapore",
    carbonReductionPct: 31,
    costDelta: 0.08,
    notes: "Heat-safe and stackable for delivery riders.",
  },
  {
    id: "pkg-2",
    menuType: "Soups and curries",
    currentMaterial: "PET bowl",
    suggestedMaterial: "Plant-fibre soup tub",
    supplier: "BioPak SEA",
    carbonReductionPct: 27,
    costDelta: 0.11,
    notes: "Works for high-temperature gravies with a tighter seal.",
  },
  {
    id: "pkg-3",
    menuType: "Bakery items",
    currentMaterial: "Plastic sleeve",
    suggestedMaterial: "Kraft paper wrap",
    supplier: "The Better Packaging Co.",
    carbonReductionPct: 42,
    costDelta: -0.03,
    notes: "Cheaper for single pastries and visually stronger on shelf.",
  },
];

const rewardTiers: RewardTier[] = [
  {
    name: "Bronze",
    minPoints: 0,
    color: "bg-amber-700",
    benefits: ["5% surplus discount", "1 pt per $1"],
  },
  {
    name: "Silver",
    minPoints: 300,
    color: "bg-slate-400",
    benefits: ["10% surplus discount", "1.5 pts per $1", "Priority reservations"],
  },
  {
    name: "Gold",
    minPoints: 600,
    color: "bg-yellow-500",
    benefits: [
      "15% surplus discount",
      "2 pts per $1",
      "Priority + free delivery",
      "Exclusive items",
    ],
  },
];

function toHoursText(hours: number) {
  if (hours <= 0) {
    return "Ended";
  }

  if (Number.isInteger(hours)) {
    return `${hours}h left`;
  }

  const fullHours = Math.floor(hours);
  const mins = Math.round((hours - fullHours) * 60);

  if (fullHours === 0) {
    return `${mins}m left`;
  }

  return `${fullHours}h ${mins}m left`;
}

function discountPct(originalPrice: number, marketPrice: number) {
  if (originalPrice <= 0) {
    return 0;
  }

  return Math.max(0, Math.round(((originalPrice - marketPrice) / originalPrice) * 100));
}

function normalizePackagingOption(option: string) {
  const trimmed = option.trim();
  const normalized = trimmed.toLowerCase();

  if (normalized === "byo container" || normalized === "bring your own container") {
    return "Bring your own container";
  }

  return trimmed;
}

function dedupePackagingOptions(options: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const option of options) {
    const normalized = normalizePackagingOption(option);
    const key = normalized.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }

  return result;
}

export default function HomePage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [signedIn, setSignedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>("business");
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [toast, setToast] = useState("");

  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);
  const [businessProfiles, setBusinessProfiles] =
    useState<Record<string, BusinessProfile>>(initialBusinessProfiles);

  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [listings, setListings] = useState<ListingItem[]>(initialMarketplace);

  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<Omit<InventoryItem, "id" | "forecastDemand">>({
    name: "",
    category: "",
    quantity: 0,
    unit: "kg",
    minThreshold: 0,
    expiryDays: 7,
  });

  const [settingsStoreName, setSettingsStoreName] = useState("");
  const [settingsLocation, setSettingsLocation] = useState("");
  const [settingsPackagingText, setSettingsPackagingText] = useState("");

  const [packagingChoiceByListing, setPackagingChoiceByListing] = useState<Record<string, string>>({});

  const [customerPoints, setCustomerPoints] = useState(380);
  const [customerPurchases, setCustomerPurchases] = useState(12);
  const [customerActions, setCustomerActions] = useState(8);

  const availableTabs = useMemo(
    () => tabs.filter((item) => item.userTypes.includes(userType)),
    [userType],
  );

  const currentTier =
    rewardTiers
      .slice()
      .reverse()
      .find((tier) => customerPoints >= tier.minPoints) ?? rewardTiers[0];
  const nextTier = rewardTiers.find((tier) => tier.minPoints > customerPoints);

  const businessViewStoreName =
    currentBusinessId && businessProfiles[currentBusinessId]
      ? businessProfiles[currentBusinessId].storeName
      : "Business";

  function openToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function preloadBusinessSettings(businessId: string) {
    const profile = businessProfiles[businessId];

    if (!profile) {
      return;
    }

    setSettingsStoreName(profile.storeName);
    setSettingsLocation(profile.location);
    setSettingsPackagingText(profile.packagingOptions.join(", "));
  }

  function handleLogin() {
    setAuthError("");
    const user = demoAccounts[email.toLowerCase()];

    if (!user || user.password !== password) {
      setAuthError("Invalid email or password.");
      return;
    }

    setSignedIn(true);
    setUserType(user.userType);

    if (user.userType === "business" && user.businessId) {
      setCurrentBusinessId(user.businessId);
      preloadBusinessSettings(user.businessId);
      setActiveTab("home");
    } else {
      setCurrentBusinessId(null);
      setActiveTab("marketplace");
    }

    openToast("Signed in successfully.");
  }

  function handleSignup() {
    setAuthError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setAuthError("Please fill all fields.");
      return;
    }

    setSignedIn(true);

    if (userType === "business") {
      const businessId = `biz-${Date.now()}`;
      const profile: BusinessProfile = {
        storeName: name.trim(),
        location: "",
        packagingOptions: ["Standard pack"],
      };

      setBusinessProfiles((prev) => ({ ...prev, [businessId]: profile }));
      setCurrentBusinessId(businessId);
      setSettingsStoreName(profile.storeName);
      setSettingsLocation(profile.location);
      setSettingsPackagingText(profile.packagingOptions.join(", "));
      setActiveTab("settings");
    } else {
      setCurrentBusinessId(null);
      setActiveTab("marketplace");
    }

    openToast("Account created.");
  }

  function logout() {
    setSignedIn(false);
    setMode("login");
    setEmail("");
    setPassword("");
    setAuthError("");
    setToast("");
    setCurrentBusinessId(null);
  }

  function orderListing(listingId: string, packagingChoice: string) {
    setListings((prev) =>
      prev.map((listing) => {
        if (listing.id !== listingId || listing.quantity <= 0) {
          return listing;
        }

        return { ...listing, quantity: listing.quantity - 1 };
      }),
    );

    setCustomerPoints((value) => value + 20);
    setCustomerPurchases((value) => value + 1);
    setCustomerActions((value) => value + 1);
    openToast(`Order confirmed. Packaging: ${packagingChoice}`);
  }

  function updateBusinessListing(
    listingId: string,
    updates: Partial<Pick<ListingItem, "marketPrice" | "timeLeftHours" | "quantity">>,
  ) {
    setListings((prev) =>
      prev.map((listing) => {
        if (listing.id !== listingId) {
          return listing;
        }

        return { ...listing, ...updates };
      }),
    );
  }

  function addBusinessListing() {
    if (!currentBusinessId) {
      return;
    }

    const newListing: ListingItem = {
      id: `mkt-${Date.now()}`,
      businessId: currentBusinessId,
      name: "New Surplus Item",
      originalPrice: 10,
      marketPrice: 6,
      quantity: 5,
      timeLeftHours: 2,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    };

    setListings((prev) => [newListing, ...prev]);
    openToast("New marketplace item added.");
  }

  function saveBusinessSettings() {
    if (!currentBusinessId) {
      return;
    }

    const parsedOptions = settingsPackagingText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setBusinessProfiles((prev) => ({
      ...prev,
      [currentBusinessId]: {
        storeName: settingsStoreName.trim() || "My Store",
        location: settingsLocation.trim(),
        packagingOptions: parsedOptions.length > 0 ? parsedOptions : ["Standard pack"],
      },
    }));

    openToast("Business settings saved.");
  }

  function resetItemForm() {
    setEditingItemId(null);
    setItemForm({
      name: "",
      category: "",
      quantity: 0,
      unit: "kg",
      minThreshold: 0,
      expiryDays: 7,
    });
  }

  function saveInventoryItem() {
    if (!itemForm.name.trim() || !itemForm.category.trim()) {
      return;
    }

    if (editingItemId) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                ...itemForm,
                forecastDemand:
                  itemForm.quantity <= itemForm.minThreshold ? "High" : "Moderate",
              }
            : item,
        ),
      );
      openToast("Inventory item updated.");
    } else {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        ...itemForm,
        forecastDemand: itemForm.quantity <= itemForm.minThreshold ? "High" : "Moderate",
      };
      setInventory((prev) => [newItem, ...prev]);
      openToast("Inventory item added.");
    }

    setShowItemDialog(false);
    resetItemForm();
  }

  function editInventoryItem(item: InventoryItem) {
    setEditingItemId(item.id);
    setItemForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minThreshold: item.minThreshold,
      expiryDays: item.expiryDays,
    });
    setShowItemDialog(true);
  }

  function deleteInventoryItem(id: string) {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    openToast("Inventory item removed.");
  }

  if (!signedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-4xl text-white">
              <Leaf className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">WasteLess Eats</h1>
            <p className="mt-2 text-sm text-gray-600">Sustainability for F&Bs in Singapore</p>
          </div>

          {mode === "signup" ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserType("business")}
                className={`rounded-xl border-2 p-4 transition ${
                  userType === "business"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Store
                  className={`mx-auto mb-2 h-8 w-8 ${
                    userType === "business" ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-sm ${
                    userType === "business" ? "text-green-900" : "text-gray-600"
                  }`}
                >
                  Business
                </p>
              </button>
              <button
                onClick={() => setUserType("customer")}
                className={`rounded-xl border-2 p-4 transition ${
                  userType === "customer"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <ShoppingBag
                  className={`mx-auto mb-2 h-8 w-8 ${
                    userType === "customer" ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-sm ${
                    userType === "customer" ? "text-green-900" : "text-gray-600"
                  }`}
                >
                  Customer
                </p>
              </button>
            </div>
          ) : null}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-center text-xl font-semibold text-gray-900">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <div className="mt-5 space-y-4">
              {mode === "signup" ? (
                <div>
                  <label className="mb-1.5 block text-sm text-gray-700">
                    Name / Business Name
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              ) : null}

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">Email</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">Password</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {authError ? (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <p className="text-sm text-red-700">{authError}</p>
                </div>
              ) : null}

              <button
                onClick={mode === "login" ? handleLogin : handleSignup}
                className="w-full rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white hover:bg-green-700"
              >
                {mode === "login" ? "Sign In" : "Sign Up"}
              </button>

              <div className="text-center">
                <button
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setAuthError("");
                  }}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  {mode === "login"
                    ? "Don\u2019t have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-900">Quick Demo Access:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <p>Business: business@demo.com / demo123</p>
              <p>Customer: customer@demo.com / demo123</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">WasteLess Eats</h1>
              <p className="text-xs text-gray-600">
                {userType === "customer"
                  ? "Save food, earn rewards"
                  : `${businessViewStoreName} · ${
                      currentBusinessId
                        ? businessProfiles[currentBusinessId]?.location || "Set your location"
                        : "Business"
                    }`}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6 pb-24">
        {activeTab === "home" ? <HomeScreen /> : null}

        {activeTab === "inventory" ? (
          <InventoryScreen
            inventory={inventory}
            setShowItemDialog={setShowItemDialog}
            onEdit={editInventoryItem}
            onDelete={deleteInventoryItem}
          />
        ) : null}

        {activeTab === "marketplace" ? (
          <MarketplaceScreen
            userType={userType}
            listings={listings}
            currentBusinessId={currentBusinessId}
            businessProfiles={businessProfiles}
            packagingChoiceByListing={packagingChoiceByListing}
            onPackagingChoiceChange={(listingId, packagingChoice) =>
              setPackagingChoiceByListing((prev) => ({
                ...prev,
                [listingId]: packagingChoice,
              }))
            }
            onOrder={orderListing}
            onUpdateListing={updateBusinessListing}
            onAddListing={addBusinessListing}
            onToast={openToast}
          />
        ) : null}

        {activeTab === "packaging" ? <PackagingScreen /> : null}

        {activeTab === "rewards" ? (
          <RewardsScreen
            userType={userType}
            points={customerPoints}
            purchases={customerPurchases}
            actions={customerActions}
            currentTier={currentTier}
            nextTier={nextTier}
          />
        ) : null}

        {activeTab === "analytics" ? <AnalyticsScreen /> : null}

        {activeTab === "settings" && userType === "business" ? (
          <BusinessSettingsScreen
            storeName={settingsStoreName}
            location={settingsLocation}
            packagingText={settingsPackagingText}
            onStoreNameChange={setSettingsStoreName}
            onLocationChange={setSettingsLocation}
            onPackagingTextChange={setSettingsPackagingText}
            onSave={saveBusinessSettings}
          />
        ) : null}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white px-4 py-2">
        <div className="mx-auto max-w-md">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}
          >
            {availableTabs.map((tab) => {
              const active = activeTab === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => setActiveTab(tab.path)}
                  className={`flex flex-col items-center justify-center rounded-lg px-1 py-2 transition-colors ${
                    active
                      ? "bg-green-50 text-green-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span className="mt-1 text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {showItemDialog ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingItemId ? "Edit Item" : "Add New Item"}
            </h3>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Item name"
                value={itemForm.name}
                onChange={(event) =>
                  setItemForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Category"
                value={itemForm.category}
                onChange={(event) =>
                  setItemForm((prev) => ({ ...prev, category: event.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  type="number"
                  placeholder="Quantity"
                  value={itemForm.quantity}
                  onChange={(event) =>
                    setItemForm((prev) => ({
                      ...prev,
                      quantity: Number(event.target.value || 0),
                    }))
                  }
                />
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Unit"
                  value={itemForm.unit}
                  onChange={(event) =>
                    setItemForm((prev) => ({ ...prev, unit: event.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  type="number"
                  placeholder="Min threshold"
                  value={itemForm.minThreshold}
                  onChange={(event) =>
                    setItemForm((prev) => ({
                      ...prev,
                      minThreshold: Number(event.target.value || 0),
                    }))
                  }
                />
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  type="number"
                  placeholder="Expiry days"
                  value={itemForm.expiryDays}
                  onChange={(event) =>
                    setItemForm((prev) => ({
                      ...prev,
                      expiryDays: Number(event.target.value || 0),
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowItemDialog(false);
                  resetItemForm();
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveInventoryItem}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Welcome back! 👋</h2>
        <p className="text-sm text-gray-600">Here&apos;s your sustainability impact today</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Waste Reduced"
          value="12.4 kg"
          icon={<TrendingDown className="h-4 w-4" />}
          trend="↓ 23% vs yesterday"
        />
        <MetricCard
          title="CO2 Saved"
          value="8.2 kg"
          icon={<Leaf className="h-4 w-4" />}
          trend="↑ 15% this week"
        />
        <MetricCard
          title="Items Sold"
          value="18"
          icon={<Package className="h-4 w-4" />}
          trend="6 items surplus"
        />
        <MetricCard
          title="Rewards Given"
          value="340 pts"
          icon={<Star className="h-4 w-4" />}
          trend="12 customers"
        />
      </div>

      <section className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <h3 className="font-semibold text-green-900">Quick Actions</h3>
        <div className="mt-3 space-y-3">
          <button className="w-full rounded-lg border border-green-200 bg-white p-3 text-left text-sm text-green-900">
            📦 Add surplus items to marketplace
          </button>
          <button className="w-full rounded-lg border border-green-200 bg-white p-3 text-left text-sm text-green-900">
            📊 Update inventory levels
          </button>
          <button className="w-full rounded-lg border border-green-200 bg-white p-3 text-left text-sm text-green-900">
            🎁 Review customer rewards
          </button>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <div className="text-green-600">{icon}</div>
      </div>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-green-600">{trend}</p>
    </article>
  );
}

function InventoryScreen({
  inventory,
  setShowItemDialog,
  onEdit,
  onDelete,
}: {
  inventory: InventoryItem[];
  setShowItemDialog: (value: boolean) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}) {
  const lowStock = inventory.filter((item) => item.quantity < item.minThreshold);
  const expiring = inventory.filter((item) => item.expiryDays <= 3);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Inventory Tracker</h2>
          <p className="text-sm text-gray-600">Monitor and forecast ingredient usage</p>
        </div>
        <button
          onClick={() => setShowItemDialog(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {lowStock.length > 0 ? (
        <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-gray-900">
                {lowStock.length} items below minimum threshold
              </p>
              <p className="text-sm text-gray-600">
                {lowStock.map((item) => item.name).join(", ")}
              </p>
            </div>
          </div>
        </article>
      ) : null}

      {expiring.length > 0 ? (
        <article className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-gray-900">{expiring.length} items expiring soon</p>
              <p className="text-sm text-gray-600">
                Consider listing these on the marketplace.
              </p>
            </div>
          </div>
        </article>
      ) : null}

      <section className="space-y-3">
        {inventory.map((item) => {
          const isLow = item.quantity < item.minThreshold;
          const pct = Math.min(
            100,
            Math.round((item.quantity / Math.max(item.minThreshold, 1)) * 100),
          );

          return (
            <article
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <div className="flex gap-2">
                  {isLow ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                      Low
                    </span>
                  ) : null}
                  {item.expiryDays <= 3 ? (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                      Expiring
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Current</p>
                  <p className="font-medium text-gray-900">
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Min Level</p>
                  <p className="font-medium text-gray-900">
                    {item.minThreshold} {item.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Expires</p>
                  <p className="font-medium text-gray-900">{item.expiryDays}d</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-1.5 rounded-full ${
                      isLow ? "bg-amber-500" : "bg-green-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-600">Forecast: {item.forecastDemand}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-red-300 px-3 py-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function MarketplaceScreen({
  userType,
  listings,
  currentBusinessId,
  businessProfiles,
  packagingChoiceByListing,
  onPackagingChoiceChange,
  onOrder,
  onUpdateListing,
  onAddListing,
  onToast,
}: {
  userType: UserType;
  listings: ListingItem[];
  currentBusinessId: string | null;
  businessProfiles: Record<string, BusinessProfile>;
  packagingChoiceByListing: Record<string, string>;
  onPackagingChoiceChange: (listingId: string, packagingChoice: string) => void;
  onOrder: (listingId: string, packagingChoice: string) => void;
  onUpdateListing: (
    listingId: string,
    updates: Partial<Pick<ListingItem, "marketPrice" | "timeLeftHours" | "quantity">>,
  ) => void;
  onAddListing: () => void;
  onToast: (message: string) => void;
}) {
  const businessListings = currentBusinessId
    ? listings.filter((listing) => listing.businessId === currentBusinessId)
    : [];

  const customerListings = listings;

  if (userType === "business") {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">My Surplus Marketplace</h2>
            <p className="text-sm text-gray-600">
              Manage only your own items, pricing, time left, and quantity.
            </p>
          </div>
          <button
            onClick={onAddListing}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        {businessListings.length === 0 ? (
          <article className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="font-medium text-gray-900">No items listed yet</p>
            <p className="mt-1 text-sm text-gray-600">
              Add your first surplus item and it will appear to customers.
            </p>
          </article>
        ) : null}

        <div className="space-y-4">
          {businessListings.map((item) => {
            const storeName =
              businessProfiles[item.businessId]?.storeName || "Unknown Store";

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      alt={item.name}
                      className="h-full w-full object-cover"
                      fill
                      sizes="96px"
                      src={item.image}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{storeName}</p>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <label>
                        <span className="mb-1 block text-xs text-gray-500">Market Price</span>
                        <input
                          type="number"
                          step="0.1"
                          defaultValue={item.marketPrice}
                          onBlur={(event) => {
                            const value = Number(event.target.value || 0);
                            onUpdateListing(item.id, {
                              marketPrice: Math.max(0, value),
                            });
                          }}
                          className="w-full rounded-lg border border-gray-300 px-2 py-1.5"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-xs text-gray-500">Time Left (h)</span>
                        <input
                          type="number"
                          step="0.5"
                          defaultValue={item.timeLeftHours}
                          onBlur={(event) => {
                            const value = Number(event.target.value || 0);
                            onUpdateListing(item.id, {
                              timeLeftHours: Math.max(0, value),
                            });
                          }}
                          className="w-full rounded-lg border border-gray-300 px-2 py-1.5"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-xs text-gray-500">Quantity</span>
                        <input
                          type="number"
                          defaultValue={item.quantity}
                          onBlur={(event) => {
                            const value = Number(event.target.value || 0);
                            onUpdateListing(item.id, {
                              quantity: Math.max(0, value),
                            });
                          }}
                          className="w-full rounded-lg border border-gray-300 px-2 py-1.5"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() => onToast("Marketplace item updated.")}
                      className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Surplus Marketplace</h2>
        <p className="text-sm text-gray-600">
          Browse surplus from all participating businesses.
        </p>
      </div>

      <section className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold">
              {customerListings.filter((item) => item.quantity > 0).length}
            </p>
            <p className="text-xs opacity-90">Available Now</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">156</p>
            <p className="text-xs opacity-90">Saved This Week</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">$2.4k</p>
            <p className="text-xs opacity-90">Total Savings</p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {customerListings.map((item) => {
          const soldOut = item.quantity <= 0;
          const store = businessProfiles[item.businessId];
          const baseOptions = store?.packagingOptions.length
            ? store.packagingOptions
            : ["Standard pack"];
          const options = dedupePackagingOptions([
            "Bring your own container",
            ...baseOptions,
          ]);
          const selectedFromState = packagingChoiceByListing[item.id];
          const selectedPackaging =
            selectedFromState && options.includes(selectedFromState)
              ? selectedFromState
              : options[0];

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    alt={item.name}
                    className="h-full w-full object-cover"
                    fill
                    sizes="96px"
                    src={item.image}
                  />
                  <div className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
                    -{discountPct(item.originalPrice, item.marketPrice)}%
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {store?.storeName || "Unknown Store"}
                      </p>
                      <p className="text-xs text-gray-500">{store?.location || "No location"}</p>
                    </div>
                    <span className="ml-2 whitespace-nowrap rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs text-green-700">
                      {item.quantity} left
                    </span>
                  </div>

                  <div className="mb-2 text-sm text-gray-600">{toHoursText(item.timeLeftHours)}</div>

                  <label className="mb-3 block text-sm text-gray-600">
                    Packaging option
                    <select
                      value={selectedPackaging}
                      onChange={(event) =>
                        onPackagingChoiceChange(item.id, event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm"
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                      <span className="font-semibold text-green-600">
                        ${item.marketPrice.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => onOrder(item.id, selectedPackaging)}
                      disabled={soldOut}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                        soldOut
                          ? "cursor-not-allowed bg-gray-200 text-gray-500"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {soldOut ? "Sold Out" : "Order"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function BusinessSettingsScreen({
  storeName,
  location,
  packagingText,
  onStoreNameChange,
  onLocationChange,
  onPackagingTextChange,
  onSave,
}: {
  storeName: string;
  location: string;
  packagingText: string;
  onStoreNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPackagingTextChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Business Settings</h2>
        <p className="text-sm text-gray-600">
          Set your store identity and packaging options for customer orders.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-gray-600">Store Name</span>
            <input
              value={storeName}
              onChange={(event) => onStoreNameChange(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Your store name"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-gray-600">Location</span>
            <input
              value={location}
              onChange={(event) => onLocationChange(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="e.g. Bugis, Marina Bay"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-gray-600">
              Packaging Options (comma separated)
            </span>
            <textarea
              value={packagingText}
              onChange={(event) => onPackagingTextChange(event.target.value)}
              className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="BYO container, Compostable box, Reusable deposit box"
            />
          </label>

          <button
            onClick={onSave}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Save Settings
          </button>
        </div>
      </section>
    </div>
  );
}

function PackagingScreen() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Packaging Optimiser</h2>
        <p className="text-sm text-gray-600">Discover eco-friendly packaging alternatives</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Eco Score</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">89/100</p>
          <p className="text-xs text-green-600">↑ 12 pts this month</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">CO2 Saved</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">142 kg</p>
          <p className="text-xs text-green-600">Monthly reduction</p>
        </article>
      </div>

      <section className="space-y-4">
        {packagingOptions.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">{item.menuType}</h3>
                <p className="text-sm text-gray-600">
                  {item.currentMaterial} to {item.suggestedMaterial}
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                -{item.carbonReductionPct}%
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600">{item.notes}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.supplier}</span>
              <span className={item.costDelta <= 0 ? "text-green-600" : "text-amber-700"}>
                {item.costDelta <= 0 ? "Save" : "Add"} ${Math.abs(item.costDelta).toFixed(2)}
                /unit
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function RewardsScreen({
  userType,
  points,
  purchases,
  actions,
  currentTier,
  nextTier,
}: {
  userType: UserType;
  points: number;
  purchases: number;
  actions: number;
  currentTier: RewardTier;
  nextTier: RewardTier | undefined;
}) {
  if (userType === "customer") {
    const progress = nextTier
      ? Math.max(
          0,
          Math.min(
            100,
            ((points - currentTier.minPoints) /
              (nextTier.minPoints - currentTier.minPoints)) *
              100,
          ),
        )
      : 100;

    return (
      <div className="space-y-6 pb-20">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Rewards</h2>
          <p className="text-sm text-gray-600">Track your sustainability impact</p>
        </div>

        <section className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Trophy className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium">{currentTier.name} Member</p>
            <p className="text-3xl font-semibold">{points} Points</p>
          </div>

          {nextTier ? (
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span>{nextTier.minPoints - points} pts to go</span>
              </div>
              <div className="h-2 rounded-full bg-white/20">
                <div
                  className="h-2 rounded-full bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}
        </section>

        <div className="grid grid-cols-2 gap-4">
          <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Purchases</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{purchases}</p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Sustainable Actions</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{actions}</p>
          </article>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900">Your Benefits</h3>
          <div className="mt-3 space-y-2">
            {currentTier.benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-gray-900"
              >
                <Star className="h-4 w-4 text-green-600" />
                {benefit}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const customers = [
    { id: "1", name: "Sarah T.", points: 850, tier: "Gold", purchases: 24 },
    { id: "2", name: "Michael L.", points: 420, tier: "Silver", purchases: 12 },
    { id: "3", name: "Priya K.", points: 680, tier: "Silver", purchases: 19 },
  ];

  const totalPoints = customers.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Rewards System</h2>
        <p className="text-sm text-gray-600">Incentivize sustainable consumption</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Points</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{totalPoints}</p>
          <p className="text-xs text-green-600">↑ 15% this month</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Active Members</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{customers.length}</p>
          <p className="text-xs text-green-600">Growing steadily</p>
        </article>
      </div>

      <section className="space-y-3">
        {customers.map((customer, idx) => (
          <article
            key={customer.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                  #{idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.purchases} purchases</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                {customer.tier}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reward points</span>
              <span className="font-medium text-green-600">{customer.points}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function AnalyticsScreen() {
  const weeklyWaste = [18, 15, 12, 10, 14, 16, 11];
  const peak = Math.max(...weeklyWaste);

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
        <p className="text-sm text-gray-600">Track your sustainability impact</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="CO2 Saved"
          value="342 kg"
          icon={<Leaf className="h-4 w-4" />}
          trend="+23% vs last month"
        />
        <MetricCard
          title="Cost Savings"
          value="$1,850"
          icon={<DollarSign className="h-4 w-4" />}
          trend="+31% vs last month"
        />
        <MetricCard
          title="Meals Rescued"
          value="156"
          icon={<ShoppingBag className="h-4 w-4" />}
          trend="+45% vs last month"
        />
        <MetricCard
          title="Water Saved"
          value="1,240 L"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="+18% vs last month"
        />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900">Daily Waste (kg)</h3>
        <div className="mt-4 flex items-end gap-2">
          {weeklyWaste.map((value, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-green-500"
                style={{ height: `${(value / peak) * 120}px` }}
              />
              <span className="text-xs text-gray-500">
                {["M", "T", "W", "T", "F", "S", "S"][index]}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-600">Average: 13.7 kg/day (8% below target)</p>
      </section>

      <section className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white">
        <h3 className="font-semibold">Impact Summary</h3>
        <p className="mt-2 text-sm opacity-90">
          You&apos;ve reduced waste by 28% this month, helping rescue more meals while lowering
          your carbon footprint.
        </p>
      </section>
    </div>
  );
}
