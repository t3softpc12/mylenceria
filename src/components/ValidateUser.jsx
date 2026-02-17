import React, { useState,useEffect, forwardRef, useImperativeHandle } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileGuest from "./ProfileGuest";
import ProfileLoggedIn from "./ProfileLoggedIn";
import { FaTimes } from "react-icons/fa";

const ValidateUser = forwardRef((props, ref) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { user } = useAuth();
  

  useImperativeHandle(ref, () => ({
    openPopup: () => {
      if (!openDrawer) {  // Check if drawer is already open
        setOpenDrawer(true); 
        console.log("Drawer opened");
      }
    },
  }));



    const handleCloseDrawer = () => {
    if (openDrawer) { // Ensure we only close if the drawer is open
      console.log("Drawer closing...");
      setOpenDrawer(false); // Close the drawer
    }
  };



  return (
    <>
      {openDrawer && (
        <div
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh",padding: "20px",
            background: "rgba(0,0,0,0.3)", zIndex: 2000 }}
          onClick={handleCloseDrawer}
        />
      )}

      {openDrawer && (
        <div style={{
          position: "fixed", top: 0, right: 0, width: "25vw", height: "100vh",padding: "20px",
          background: "white", boxShadow: "0 0 15px rgba(0,0,0,0.3)", zIndex: 3000
        }}>


            <div>
                    <div className="d-flex justify-content-between p-0">
                      <div><span  style={{
                              fontSize: "0.9rem",
                              color: "#c7325fff",
                              fontFamily: "'Comic Sans MS', cursive, sans-serif",
                            }}
                          > Heyyy welcome !
                          </span>
                      </div>
          
                      <FaTimes
                        size={20}
                        onClick={handleCloseDrawer}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    </div>
          {user ? (
            <ProfileLoggedIn handleCloseDrawer={handleCloseDrawer} />
          ) : (
            <ProfileGuest handleCloseDrawer={handleCloseDrawer} />
          )}
        </div>
      )}
    </>
  );
});

export default ValidateUser;
