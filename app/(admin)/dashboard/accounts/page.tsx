"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Shield,
  Edit,
  Trash2,
  Key,
  UserPlus,
  Settings,
  Lock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  getAccounts,
  createAccount,
  getAvailablePermissions,
  assignPermissions,
  deleteAccount,
} from "@/lib/data/routes/account/account";
import {
  Account,
  Permission,
  CreateAccountRequest,
  AssignPermissionsRequest,
} from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const formatPermissionName = (permissionName: string): string => {
  return permissionName
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountPermissions, setAccountPermissions] = useState<{
    [key: string]: string[];
  }>({});

  const [accountForm, setAccountForm] = useState<CreateAccountRequest>({
    username: "",
    password: "",
    role: "staff",
  });

  const [permissionForm, setPermissionForm] = useState<
    AssignPermissionsRequest & { accountId: string }
  >({
    accountId: "",
    permissions: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAccounts();
    fetchAvailablePermissions();
  }, []);

  const fetchAccounts = async () => {
    try {
      const accountsData = await getAccounts();
      if (accountsData) {
        setAccounts(accountsData);
        // Initialize with empty permissions for all accounts
        const initialPermissions: { [key: string]: string[] } = {};
        accountsData.forEach((account) => {
          initialPermissions[account.id] = [];
        });
        setAccountPermissions(initialPermissions);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch accounts");
    }
  };

  const fetchAvailablePermissions = async () => {
    try {
      const permissionsData = await getAvailablePermissions();
      if (permissionsData) {
        setAvailablePermissions(permissionsData);
      }
    } catch (error) {
      console.error("Error fetching available permissions:", error);
      toast.error("Failed to fetch available permissions");
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!accountForm.username.trim()) {
      newErrors.username = "Username is required";
    } else if (accountForm.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!accountForm.password) {
      newErrors.password = "Password is required";
    } else if (accountForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log("Attempting to create account with:", accountForm);

      const newAccount = await createAccount(accountForm);
      console.log("Account created successfully:", newAccount);

      setAccounts((prev) => [...prev, newAccount]);
      // Initialize permissions for the new account
      setAccountPermissions((prev) => ({
        ...prev,
        [newAccount.id]: [],
      }));
      setAccountForm({ username: "", password: "", role: "staff" });
      toast.success("Account created successfully!");

      const dialogTrigger = document.querySelector('[data-state="open"]');
      if (dialogTrigger) {
        (dialogTrigger as HTMLElement).click();
      }
    } catch (error: any) {
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);

      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error creating account. Please try again.";

      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPermissions = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!permissionForm.accountId) {
      toast.error("No account selected");
      return;
    }

    if (permissionForm.permissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setLoading(true);

    try {
      console.log(
        "Assigning permissions to account:",
        permissionForm.accountId
      );
      console.log("With permissions:", permissionForm.permissions);

      const results = [];
      const alreadyGrantedPermissions = [];
      const failedPermissions = [];

      // Assign each permission individually and track results
      for (const permissionId of permissionForm.permissions) {
        try {
          await assignPermissions(permissionForm.accountId, permissionId);
          results.push({ permissionId, status: "success" });
        } catch (error: any) {
          if (error.response?.status === 409) {
            // Permission already granted
            results.push({ permissionId, status: "already_granted" });
            alreadyGrantedPermissions.push(permissionId);
          } else {
            // Other error
            results.push({ permissionId, status: "failed" });
            failedPermissions.push(permissionId);
            console.error(
              `Failed to assign permission ${permissionId}:`,
              error
            );
          }
        }
      }

      // Calculate counts for feedback
      const successfulAssignments = results.filter(
        (r) => r.status === "success"
      ).length;
      const alreadyGrantedCount = alreadyGrantedPermissions.length;
      const failedCount = failedPermissions.length;

      // Update local state with all selected permissions (including already granted ones)
      setAccountPermissions((prev) => ({
        ...prev,
        [permissionForm.accountId]: permissionForm.permissions,
      }));

      setShowPermissionModal(false);
      setPermissionForm({ accountId: "", permissions: [] });

      // Show appropriate success message
      if (failedCount === 0) {
        if (alreadyGrantedCount > 0) {
          toast.success(
            `Permissions assigned! ${successfulAssignments} new permissions granted, ${alreadyGrantedCount} were already assigned.`
          );
        } else {
          toast.success("All permissions assigned successfully!");
        }
      } else {
        toast.success(
          `Assigned ${successfulAssignments} permissions. ${alreadyGrantedCount} were already assigned. ${failedCount} failed.`
        );
      }
    } catch (error) {
      console.error("Error assigning permissions:", error);
      toast.error("Error assigning permissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await deleteAccount(accountId);
      setAccounts((prev) => prev.filter((account) => account.id !== accountId));
      // Remove from permissions state as well
      setAccountPermissions((prev) => {
        const newPermissions = { ...prev };
        delete newPermissions[accountId];
        return newPermissions;
      });
      toast.success("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account. Please try again.");
    }
  };

  const handlePermissionChange = (permissionId: string) => {
    setPermissionForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const openPermissionModal = async (account: Account) => {
    setSelectedAccount(account);

    // Use locally stored permissions since we can't fetch from backend
    const currentPermissions = accountPermissions[account.id] || [];

    setPermissionForm({
      accountId: account.id,
      permissions: currentPermissions,
    });
    setShowPermissionModal(true);
  };

  const getPermissionDescription = (permissionName: string): string => {
    const descriptions: { [key: string]: string } = {
      MANAGE_INVENTORY:
        "Can view, update, and manage inventory levels and stock",
      MANAGE_DELIVERIES: "Can create, track, and manage delivery orders",
      MANAGE_PRODUCTS: "Can add, edit, and manage product catalog",
      MANAGE_FORECASTS: "Can access and manage sales forecasts and predictions",
      MANAGE_SALES: "Can view and manage sales data and reports",
    };
    return descriptions[permissionName] || "Manage system permissions";
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Settings size={14} />;
      case "manager":
        return <Shield size={14} />;
      default:
        return <Users size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/80 p-6 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-blue-100/30 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative space-y-6 max-w-7xl mx-auto">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/40 shadow-xs hover:shadow-sm transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/90 to-indigo-600/90 rounded-xl shadow-lg backdrop-blur-sm border border-white/20">
                <Users className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Account Management
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30 w-fit">
                  <Lock size={16} />
                  Manage staff accounts and permissions
                </p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="group flex items-center gap-3 bg-gradient-to-r from-purple-500/90 to-indigo-600/90 text-white px-6 py-3 rounded-xl hover:from-purple-600/90 hover:to-indigo-700/90 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm">
                  <UserPlus size={20} />
                  <span className="font-semibold">Create Account</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl max-w-md">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100/80 backdrop-blur-sm rounded-lg border border-white/30">
                      <UserPlus className="text-purple-600" size={20} />
                    </div>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                      Create Staff Account
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-gray-600">
                    Create a new staff account with specific role and
                    permissions.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateAccount} className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="flex items-center gap-2 text-sm font-semibold"
                    >
                      <Users size={16} className="text-purple-500" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      required
                      value={accountForm.username}
                      onChange={(e) => {
                        setAccountForm((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }));
                        if (errors.username) {
                          setErrors((prev) => ({ ...prev, username: "" }));
                        }
                      }}
                      className={`w-full border-gray-200/80 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm border ${
                        errors.username ? "border-red-300" : ""
                      }`}
                      placeholder="Enter username"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2 text-sm font-semibold"
                    >
                      <Lock size={16} className="text-purple-500" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={accountForm.password}
                      onChange={(e) => {
                        setAccountForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }));
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: "" }));
                        }
                      }}
                      className={`w-full border-gray-200/80 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm border ${
                        errors.password ? "border-red-300" : ""
                      }`}
                      placeholder="Enter password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="flex items-center gap-2 text-sm font-semibold"
                    >
                      <Shield size={16} className="text-purple-500" />
                      Role
                    </Label>
                    <Select
                      value={accountForm.role}
                      onValueChange={(value) =>
                        setAccountForm((prev) => ({
                          ...prev,
                          role: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full border-gray-200/80 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm border">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 backdrop-blur-lg border border-white/40 rounded-xl">
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-gray-300/80 text-gray-600 rounded-xl hover:bg-gray-50/80 transition-all duration-300 font-medium backdrop-blur-sm"
                      >
                        Cancel
                      </Button>
                    </DialogTrigger>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 text-white rounded-xl hover:from-purple-600/90 hover:to-indigo-600/90 transition-all duration-300 font-semibold shadow-md hover:shadow-lg border border-white/20 backdrop-blur-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/40 shadow-xs hover:shadow-sm transition-shadow duration-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100/80 backdrop-blur-sm rounded-lg border border-white/30">
                <Users className="text-purple-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Staff Accounts
              </h2>
              <span className="px-3 py-1 bg-purple-100/80 text-purple-600 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30">
                {accounts.length} accounts
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100/50 bg-white/30 backdrop-blur-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50/50 to-indigo-50/30 border-b border-purple-100/50 backdrop-blur-sm">
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      Role
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      Created
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      Permissions
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-purple-50/30 hover:bg-white/40 transition-colors duration-200 group backdrop-blur-sm"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400/90 to-indigo-500/90 rounded-xl flex items-center justify-center shadow-md border border-white/20">
                            <Users size={20} className="text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {account.username}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Key size={12} />
                              ID: {account.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm border ${
                              account.role === "superadmin"
                                ? "bg-red-100/80 text-red-700 border-red-200/50"
                                : account.role === "manager"
                                ? "bg-blue-100/80 text-blue-700 border-blue-200/50"
                                : "bg-emerald-100/80 text-emerald-700 border-emerald-200/50"
                            }`}
                          >
                            {getRoleIcon(account.role)}
                            {account.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30 w-fit">
                          <Calendar size={14} className="text-purple-400" />
                          {account.createdAt}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2 max-w-xs">
                          {accountPermissions[account.id]?.map(
                            (permissionId) => {
                              const permission = availablePermissions.find(
                                (p) => p.id === permissionId
                              );
                              return permission ? (
                                <span
                                  key={permissionId}
                                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 text-white text-xs rounded-lg font-medium shadow-sm backdrop-blur-sm border border-white/20"
                                  title={getPermissionDescription(
                                    permission.name
                                  )}
                                >
                                  {formatPermissionName(permission.name)}
                                </span>
                              ) : null;
                            }
                          )}
                          {(!accountPermissions[account.id] ||
                            accountPermissions[account.id].length === 0) && (
                            <span className="text-gray-400 text-sm italic bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                              No permissions
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Dialog
                            open={showPermissionModal}
                            onOpenChange={setShowPermissionModal}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => openPermissionModal(account)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 border-purple-600 rounded-xl hover:bg-purple-100 transition-all duration-300 shadow-md backdrop-blur-sm border"
                              >
                                <Key size={14} />
                                <span className="text-sm font-medium">
                                  Permissions
                                </span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl max-w-2xl">
                              <DialogHeader>
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-purple-100/80 backdrop-blur-sm rounded-lg border border-white/30">
                                    <Key
                                      className="text-purple-600"
                                      size={20}
                                    />
                                  </div>
                                  <DialogTitle className="text-xl font-semibold text-gray-800">
                                    Assign Permissions -{" "}
                                    {selectedAccount?.username}
                                  </DialogTitle>
                                </div>
                                <DialogDescription className="text-gray-600">
                                  Select the permissions you want to assign to
                                  this account
                                </DialogDescription>
                              </DialogHeader>

                              <form
                                onSubmit={handleAssignPermissions}
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                                  {availablePermissions.map((permission) => (
                                    <label
                                      key={permission.id}
                                      className="flex items-start gap-4 p-4 border border-gray-200/80 rounded-xl hover:bg-white/60 cursor-pointer transition-colors duration-200 bg-white/40 backdrop-blur-sm"
                                    >
                                      <div className="flex items-start gap-3 flex-1">
                                        <div className="relative mt-1">
                                          <input
                                            type="checkbox"
                                            checked={permissionForm.permissions.includes(
                                              permission.id
                                            )}
                                            onChange={() =>
                                              handlePermissionChange(
                                                permission.id
                                              )
                                            }
                                            className="w-4 h-4 text-purple-500 focus:ring-purple-500/50 rounded border-gray-300/80 bg-white/80"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-2">
                                            <div className="font-semibold text-gray-800">
                                              {formatPermissionName(
                                                permission.name
                                              )}
                                            </div>
                                            <span className="px-2 py-1 bg-purple-100/80 text-purple-600 text-xs rounded-md font-medium border border-purple-200/50 backdrop-blur-sm">
                                              {permission.id.slice(0, 8)}...
                                            </span>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {getPermissionDescription(
                                              permission.name
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  ))}
                                </div>

                                {permissionForm.permissions.length > 0 && (
                                  <div className="p-4 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 rounded-xl text-white shadow-lg backdrop-blur-sm border border-white/20">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <Shield size={16} />
                                      Selected Permissions (
                                      {permissionForm.permissions.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {permissionForm.permissions.map(
                                        (permissionId) => {
                                          const permission =
                                            availablePermissions.find(
                                              (p) => p.id === permissionId
                                            );
                                          return permission ? (
                                            <span
                                              key={permissionId}
                                              className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg font-medium border border-white/30"
                                            >
                                              {formatPermissionName(
                                                permission.name
                                              )}
                                            </span>
                                          ) : null;
                                        }
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      setShowPermissionModal(false)
                                    }
                                    className="flex-1 border-gray-300/80 text-gray-600 rounded-xl hover:bg-gray-50/80 transition-all duration-300 font-medium backdrop-blur-sm"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 text-white rounded-xl hover:from-purple-600/90 hover:to-indigo-600/90 transition-all duration-300 font-semibold shadow-md hover:shadow-lg border border-white/20 backdrop-blur-sm disabled:opacity-50"
                                  >
                                    {loading ? (
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Assigning...
                                      </div>
                                    ) : (
                                      "Assign Permissions"
                                    )}
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <Button className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all duration-300 shadow-md backdrop-blur-sm border border-green-600">
                            <Edit size={14} />
                            <span className="text-sm font-medium">Edit</span>
                          </Button>

                          {/* Delete Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 shadow-md backdrop-blur-sm border border-red-600">
                                <Trash2 size={14} />
                                <span className="text-sm font-medium">
                                  Delete
                                </span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl">
                              <AlertDialogHeader>
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-red-100/80 backdrop-blur-sm rounded-lg border border-white/30">
                                    <Trash2
                                      className="text-red-600"
                                      size={20}
                                    />
                                  </div>
                                  <AlertDialogTitle className="text-xl font-semibold text-gray-800">
                                    Delete Account
                                  </AlertDialogTitle>
                                </div>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to delete the account "
                                  {account.username}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300/80 text-gray-600 rounded-xl hover:bg-gray-50/80 transition-all duration-300 font-medium backdrop-blur-sm">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteAccount(account.id)
                                  }
                                  className="bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white rounded-xl hover:from-red-600/90 hover:to-pink-600/90 transition-all duration-300 font-semibold shadow-md hover:shadow-lg border border-white/20 backdrop-blur-sm"
                                >
                                  Delete Account
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
