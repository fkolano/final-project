const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      syncTokenFromSessionStore: () => {
        const token = sessionStore.getItem("token");
        console.log(
          "Application just loaded, syncing the session storage token"
        );
        if (token && token != "" && token != undefined)
          setStore({ token: token });
      },

      login: async (email, password) => {
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        };

        try {
          const resp = await fetch(
            "https://3000-chiznera-relocationstat-pzijzbodj3o.ws-us54.gitpod.io/api/token",
            opts
          );
          if (resp.status !== 200) {
            alert("An error has occurred");
            return false;
          }

          const data = await resp.json();
          console.log("this came from the backend", data);
          sessionStorage.setItem("token", data.access_token); //Access token needed here
          setStore({ token: data.access_token });
          return true;
        } catch (error) {
          console.error("There has be an error logging in");
        }
      },
    },

    signup: (data) => {
      const store = getStore();
      console.log("data received", data);
      console.log(JSON.stringify(data));
      return fetch(`${base_url}/api/signup/`, {
        method: "POST",
        // causing POST 500 and 401 error
        // mode: "no-cors",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.status === 409)
            throw new Error(
              "The email address already exists. Please login to your account to continue."
            );
          // else if (!res.ok) throw new Error(res.statusText);

          return res.json();
        })
        .then((data) => {
          console.log("data ", data);
          getActions().setAlert({
            type: "success",
            msg: data.msg,
            show: true,
          });

          return true;
        })
        .catch((err) => err);
    },

    handleLogin: (user) => {
      const store = getStore();
      store.user = user;
      store.user.loggedIn = true;
      setStore(store);
    },
    handleLogout: () => {
      const store = getStore();
      store.user = {
        token: "",
        email: "",
        id: null,
      };
      store.user.loggedIn = false;
      setStore(store);
    },

    addBookmark: (gun) => {
      let userObj = JSON.parse(sessionStorage.getItem("guniverse_user"));
      let user_id = userObj["id"];
      let gun_id = gun["id"];

      let payload = {
        gun: gun,
      };
      console.log("Payload: ", payload);

      return fetch(`${base_url}/api/bookmark/user/${user_id}`, {
        method: "PUT",
        // mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          // if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) =>
          setStore({
            user: {
              ...data.user,
              loggedIn: true,
            },
          })
        );
    },

    deleteBookmark: (gun) => {
      let userObj = JSON.parse(sessionStorage.getItem("guniverse_user"));
      let user_id = userObj["id"];
      let gun_id = gun["id"];

      let payload = {
        gun_id: gun_id,
      };

      console.log("Payload: ", payload);

      return fetch(`${base_url}/api/bookmark/user/${user_id}`, {
        method: "DELETE",
        // mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          // if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) =>
          setStore({
            user: {
              ...data.user,
              loggedIn: true,
            },
          })
        );
    },

    getMessage: () => {
      const store = getStore();
      const opts = {
        headers: {
          Authorization: "Bearer" + store.token,
        },
      };
      // fetching data from the backend
      fetch(process.env.BACKEND_URL + "/api/hello", opts)
        .then((resp) => resp.json())
        .then((data) => setStore({ message: data.message }))
        .catch((error) =>
          console.log("Error loading message from backend", error)
        );
    },
    changeColor: (index, color) => {
      //get the store
      const store = getStore();

      //we have to loop the entire demo array to look for the respective index
      //and change its color
      const demo = store.demo.map((elm, i) => {
        if (i === index) elm.background = color;
        return elm;
      });

      //reset the global store
      setStore({ demo: demo });
    },
  };
};

export default getState;
