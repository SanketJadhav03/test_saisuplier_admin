import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./url_helper";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function AuthUser() {
  const [loggingOut, setLoggingOut] = useState(false);
  const permissionsList = useSelector(
    (state) => state.permissionsSlice.permissionsList,
  );
  const navigate = useNavigate();
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const getUser = () => {
    const userString = JSON.parse(sessionStorage.getItem("authUser"));
    return userString;
  };

  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  const saveToken = (user, token) => {
    sessionStorage.setItem("token", JSON.stringify(token));
    sessionStorage.setItem("authUser", JSON.stringify(user));

    // setToken(token);
    setUser(user);
    // navigate("");
  };

  const http = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const https = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  const checkPermission = (permissionName) => {
    if (JSON.parse(sessionStorage.getItem("authUser")).user.email == "admin") {
      return true;
    }
    const resp = permissionsList.find(
      (permission) => permission.permission_name == permissionName,
    );
    if (resp) {
      return true;
    }
    return false;
  };

  // SUBSCRIPTION
  const checkSubscription = async () => {
    try {
      const resp = await axios.get(`${API_URL}/check-subscription`);
      if (resp.status === 3) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  };

  

  const logout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));

      if (authUser?.user?.user_id) {
        await axios.get(`${API_URL}/user/logout/${authUser.user.user_id}`);
      }
    } finally {
      sessionStorage.clear();
      setToken(null);
      setUser(null);
      navigate("/login", { replace: true });
    }
  };
  const [permission, setPermission] = useState([]);

  useEffect(() => {
    // ✅ Run only if role exists
    const role = user?.user?.role;
    if (!role) return;

    let isMounted = true;

    const fetchPermissions = async () => {
      try {
        // ✅ Check local/session cache first
        const cached = sessionStorage.getItem(`role_perm_${role}`);
        if (cached) {
          setPermission(JSON.parse(cached));
          return;
        }

        // ✅ Fetch only once per role
        const { data } = await http.get(`role/show/${role}`);
        const permissions = data?.rolesAndPermissionsData || [];

        if (isMounted) {
          setPermission(permissions);
          sessionStorage.setItem(
            `role_perm_${role}`,
            JSON.stringify(permissions),
          );
        }
      } catch (error) {
        console.error("Permission fetch failed:", error);
      }
    };

    fetchPermissions();

    // ✅ Cleanup (prevents setting state on unmounted component)
    return () => {
      isMounted = false;
    };
  }, [user?.user?.role]); // ✅ Depend only on role

  return {
    setToken: saveToken,
    token,
    user,
    http,
    https,
    logout,
    checkPermission,
    permission,
    checkSubscription,
  };
}
