import { useState } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import "../styles/list-menu.css";

//add select all button 
//add delete button 

function ListMenu({ lists, onSelectedLists}) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {lists && lists.map((list) => (
          <ListItem
            onClick={() => onSelectedLists(list.id)}
            key={list.id}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                {list.selected ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={list.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div id="list-menu">
      <Button onClick={toggleDrawer(true)} variant="outlined" color="inherit" className="custom-icon">View Lists</Button>
      <Drawer
        className="custom-drawer"
        open={open}
        anchor="right"
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}

export default ListMenu;
