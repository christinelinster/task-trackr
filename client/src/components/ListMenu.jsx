import { useState } from "react";
import { IconButton } from "@mui/material";
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
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import "../styles/ListMenu.css";

function ListMenu({ lists, selectedLists, onSelectedLists}) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {lists.map((list) => (
          <ListItem
            onClick={() => onSelectedLists(list.id)}
            key={list.id}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                {selectedLists.includes(list.id) ? (
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
      <IconButton
        onClick={toggleDrawer(true)}
        color="inherit"
        size="large"
        className="custom-icon"
      >
        <ListRoundedIcon className="icon" />
      </IconButton>
      <Drawer
        className="custom-drawer"
        open={open}
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}

export default ListMenu;
