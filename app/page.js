'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Typography, Modal, Stack, TextField, Button, Snackbar, Alert, AppBar, Toolbar, Container, CircularProgress, IconButton } from '@mui/material';
import { collection, deleteDoc, getDocs, query, setDoc, getDoc, doc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
    setLoading(false);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    setSnackbar({ open: true, message: 'Item added successfully', severity: 'success' });
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
      setSnackbar({ open: true, message: 'Item removed successfully', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Item not found', severity: 'error' });
    }
    await updateInventory();
  };

  const filterInventory = (query) => {
    if (!query) {
      setFilteredInventory(inventory);
    } else {
      const filteredList = inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredInventory(filteredList);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    filterInventory(searchQuery);
  }, [searchQuery, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ bgcolor: '#1E1E1E', color: '#FFF', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#161616' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Inventory Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="#2C2C2C"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ transform: "translate(-50%, -50%)", color: '#FFF' }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
                InputLabelProps={{
                  style: { color: '#FFF' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FFF',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFF',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFF'
                  }
                }}
              />
              <Button variant="contained" color="primary" onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}>Add</Button>
            </Stack>
          </Box>
        </Modal>

        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
          Add New Item
        </Button>

        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#FFF',
              },
              '&:hover fieldset': {
                borderColor: '#FFF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFF',
              },
            },
            '& .MuiInputBase-input': {
              color: '#FFF'
            }
          }}
        />

        <Box bgcolor="#2C2C2C" p={2} borderRadius={1}>
          <Typography variant="h4" sx={{ mb: 2, borderBottom: '2px solid #444' }}>
            Inventory Items
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '500px', overflowY: 'auto' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" bgcolor="#444" p={2} borderRadius={1}>
                <Typography variant="h6" sx={{ flex: 2 }}>
                  Item Name
                </Typography>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  Quantity
                </Typography>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  Actions
                </Typography>
              </Box>

              {filteredInventory.map(({ name, quantity }) => (
                <Box key={name} display="flex" justifyContent="space-between" alignItems="center" bgcolor="#3A3A3A" p={2} borderRadius={1}>
                  <Typography variant="h6" sx={{ flex: 2 }}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <Button variant="contained" color="primary" onClick={() => {
                      addItem(name);
                    }}>Add</Button>
                    <Button variant="contained" color="secondary" onClick={() => {
                      removeItem(name);
                    }}>Remove</Button>
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
