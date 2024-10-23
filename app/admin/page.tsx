"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useUserContextData } from '../context/userData';
import { getIdTokenResult } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

interface User {
    uid: string;
    email: string;
    displayName: string;
  }

  type Admin = {
    id: string[];
    email: string;
    admin: boolean;
    // Add more fields if necessary
  }
  
function Page() {
   
    const [users, setUsers] = useState<User[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dialogType, setDialogType] = useState<"delete" | "block" | "updatePassword" | null>(null);

    const { isAdmin } = useUserContextData(); // Ensure only admins can access this form
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");


 console.log(users)
 console.log(admins)

//  const fetchAdmins = async () => {
//   setLoading(true);
//   try {
//     // Query Firestore to find all users where admin is true
//     const q = query(collection(db, 'users'), where('admin', '==', true));
//     const querySnapshot = await getDocs(q);
    
//     // Create the admin list from query snapshot
//     const adminList = querySnapshot.docs.map((doc) => ({
//       id: doc.id, // Document ID
//       ...doc.data() // Spread the document data
//     }));

//     setAdmins(adminList);
//     console.log(adminList)
//   } catch (err) {
//     console.error('Error fetching admins:', err);
//     setError('Failed to fetch admins.');
//   } finally {
//     setLoading(false);
//   }
// };



    const addNewAdmin = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!isAdmin) {
        setErrorMessage("You are not authorized to add admins.");
        return;
      }
  
      try {
       
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          const token = await getIdTokenResult(currentUser);
          if (token.claims.admin) {
            // Add the new admin to Firestore
            await setDoc(doc(db, "users", email), {
              admin: true,
            });
  
            setSuccessMessage(`${email} has been added as an admin.`);
            setEmail(""); // Clear the form
          } else {
            setErrorMessage("You are not authorized to add admins.");
          }
        } else {
          setErrorMessage("You need to log in to perform this action.");
        }
      } catch (error) {
        console.error("Error adding admin:", error);
        setErrorMessage("An error occurred while adding the admin.");
      }
    };
  
    // const removeAdmin = async (e: React.FormEvent) => {
    //   e.preventDefault();
  
    //   if (!isAdmin) {
    //     setErrorMessage("You are not authorized to remove admins.");
    //     return;
    //   }
  
    //   const emailList = emails.split(",").map((email) => email.trim()); // Split by commas and trim spaces
    //   try {
    //     const auth = getAuth();
    //     const currentUser = auth.currentUser;
  
    //     if (currentUser) {
    //       const token = await getIdTokenResult(currentUser);
    //       if (token.claims.admin) {
    //         const promises = emailList.map(async (email) => {
    //           if (email) {
    //             // Update each user's admin field in Firestore to remove admin privileges
    //             return updateDoc(doc(firestore, "users", email), {
    //               admin: false,
    //             });
    //           }
    //         });
  
    //         // Wait for all promises to resolve
    //         await Promise.all(promises);
  
    //         setSuccessMessage(`Admins removed successfully: ${emailList.join(", ")}`);
    //         setEmails(""); // Clear the input field
    //       } else {
    //         setErrorMessage("You are not authorized to remove admins.");
    //       }
    //     } else {
    //       setErrorMessage("You need to log in to perform this action.");
    //     }
    //   } catch (error) {
    //     console.error("Error removing admins:", error);
    //     setErrorMessage("An error occurred while removing the admins.");
    //   }
    // };
  
    // if (loading) {
    //   return <p>Loading admins...</p>;
    // }
    
    // if (error) {
    //   return <p className="text-red-500">{error}</p>;
    // }
    

    const handleUsers = async () => {
        try {
          const response = await fetch("/api/getUsers", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          const result = await response.json();
    
          if (response.ok) {
            setUsers(result); // Update the state with fetched users
          } else {
            console.error(result.error); // Handle error
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      const handleDeleteUser = async (uid: string) => {
        try {
          const response = await fetch("/api/deleteUser", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid }),
          });
    
          const result = await response.json();
          if (response.ok) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
          } else {
            console.error(result.error); // Handle error
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      };
    
      const handleDisableUser = async (uid: string) => {
        try {
          const response = await fetch("/api/disableUser", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid }),
          });
    
          const result = await response.json();
          if (response.ok) {
            console.log(result.message); // Handle success (e.g., update UI)
          } else {
            console.error(result.error); // Handle error
          }
        } catch (error) {
          console.error("Error disabling user:", error);
        }
      };
    
      const handleChangePassword = async (uid: string, newPassword: string) => {
        try {
          const response = await fetch("/api/changePassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, newPassword }),
          });
    
          const result = await response.json();
          if (response.ok) {
            console.log(result.message);
          } else {
            console.error(result.error);
          }
        } catch (error) {
          console.error("Error changing password:", error);
        }
      };
    
      const openDialog = (type: "delete" | "block" | "updatePassword", user: User) => {
        setDialogType(type);
        setSelectedUser(user);
      };
    
      const closeDialog = () => {
        setDialogType(null);
        setSelectedUser(null);
        setPassword("");
      };
    
      const filterdData = users.filter((user) => user.email.toLowerCase().includes(searchValue.toLowerCase()) || user.displayName?.toLowerCase().includes(searchValue.toLowerCase()) ) 
      
      
      useEffect(() => {
        // fetchAdmins();
        handleUsers();
      }, []);

  return (
    <div className='p-5 mb-16'>
     <h2 className='font-semibold text-xl my-5'>Admin Panel</h2> 
      <div className="flex gap-3">
        <div className=" flex-col items-center flex gap-3 bg-gray-800 w-full p-5 rounded-md">
          <h3>App user</h3>
          
          <span className='p-3 bg-gray-600 rounded-md'><User/></span>
          <span className='text-4xl font-semibold'>{users.length}</span>
        </div>
        <div className=" flex-col items-center flex gap-3 bg-gray-800 w-full p-5 rounded-md" >
          <h3>Paid users</h3>
          
          <span className='p-3 bg-gray-600 rounded-md '><User/></span>
          <span className='text-4xl font-semibold'>100</span>
        </div>
       
      </div>

      <form onSubmit={addNewAdmin} className="space-y-4 mt-5 border p-5 rounded-md border-gray-600">
        <div>
          <label htmlFor="email" className="block font-medium">
            User Email:
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-transparent border-gray-600"
            placeholder="Enter user email"
          />
        </div>
        <Button type="submit" className="bg-blue-500 text-white py-2 px-4">
          Add Admin
        </Button>
      </form>


      <div className="flex gap-3 md:w-[40%] mt-5">
          <Input
             className="bg-transparent border-gray-600"
            type="search"
            placeholder="Search users ...."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {/* <Button>New user</Button> */}
        </div>

        <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-gray-800 border border-gray-600">
          <thead>
            <tr className="bg-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Number</th>
              <th className="py-3 px-6 text-center">User id</th>
              <th className="py-3 px-6 text-center">Email Address</th>
              <th className="py-3 px-6 text-center">username</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className=" text-sm font-light">
            {filterdData.map((user, index) => (
              <tr key={user.uid} className="border-b border-gray-300 hover:bg-gray-600">
                <td className="py-3 px-6 text-center">{index + 1}</td>
                <td className="py-3 px-6 text-center">{user.uid}</td>
                <td className="py-3 px-6 text-center">{user.email}</td>
                <td className="py-3 px-6 text-center">{user.displayName || "N/A"}</td>
                <td className="py-3 px-6 text-center flex gap-2">
                  <Button variant="destructive" className='bg-red-500' onClick={() => openDialog("delete", user)}>
                    Delete
                  </Button>
                  <Button className="bg-yellow-600" onClick={() => openDialog("block", user)}>
                    Disable
                  </Button>
                  <Button className='bg-blue-500' onClick={() => openDialog("updatePassword", user)}>Update password</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      {dialogType === "delete" && selectedUser && (
        <div className="fixed inset-0 bg-[#ffffffb0] dark:bg-[#25262A] z-[10] flex justify-center items-center">
          <div className="bg-white dark:bg-[#25262A] dark:border-slate-700 border shadow-lg w-[70%] md:w-[30%] h-[200px] gap-3 flex flex-col justify-center items-center rounded-md">
            <h3 className="font-semibold">Delete Confirmation</h3>
            <p>
              Are you sure you want to <span className="text-red-400">Delete {selectedUser.displayName || "N/A"}</span>?
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={closeDialog} className="text-gray-500 dark:text-white">
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteUser(selectedUser.uid)}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {dialogType === "block" && selectedUser && (
        <div className="fixed inset-0 bg-[#ffffffb0] dark:bg-[#25262A] z-[10] flex justify-center items-center">
          <div className="bg-white dark:bg-[#25262A] dark:border-slate-700 border shadow-lg w-[70%] md:w-[30%] h-[200px] gap-3 flex flex-col justify-center items-center rounded-md">
            <h3 className="font-semibold">Disable Confirmation</h3>
            <p>
              Are you sure you want to <span className="text-red-400">Disable {selectedUser.displayName || "N/A"}</span>?
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={closeDialog} className="">
                Cancel
              </Button>
              <Button className="bg-yellow-600" onClick={() => handleDisableUser(selectedUser.uid)}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {dialogType === "updatePassword" && selectedUser && (
        <div className="fixed inset-0 bg-[#ffffffb0] dark:bg-[#25262A] z-[10] flex justify-center items-center">
          <div className="bg-white  p-5 dark:bg-[#25262A] dark:border-slate-700 border shadow-lg w-[70%] md:w-[30%] h-[220px] gap-3 flex flex-col justify-center items-center rounded-md">
            <h3 className="font-semibold">Update Password Confirmation</h3>
            <p>
              Are you sure you want to update the password for <span className="font-semibold">{selectedUser.displayName || "N/A"}</span>?
            </p>
            <input
              className="p-2 text-gray-400 outline-none border border-gray-300 dark:border-slate-700 rounded-md bg-transparent focus-visible:ring-0 focus:border focus:border-black w-full"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-4">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={() => handleChangePassword(selectedUser.uid, password)}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
   

    </div>
  )
}

export default Page