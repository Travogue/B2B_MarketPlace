import { useEffect, useState } from 'react';
import { Paper, List, ListItem, ListItemText, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { Edit, Add } from '@mui/icons-material';
import { cmsAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminCMS = () => {
  const [pages, setPages] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', pageType: 'custom' });

  useEffect(() => { cmsAPI.getPages({ all: true }).then(({ data }) => setPages(data.data)); }, []);

  const handleCreate = async () => {
    await cmsAPI.create(form);
    setOpen(false);
    cmsAPI.getPages({ all: true }).then(({ data }) => setPages(data.data));
  };

  return (
    <>
      <PageHeader title="CMS Management" action={<Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Page</Button>} />
      <Paper>
        <List>
          {pages.map((p) => (
            <ListItem key={p._id} divider secondaryAction={<IconButton><Edit /></IconButton>}>
              <ListItemText primary={p.title} secondary={`/${p.slug} • ${p.pageType}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create CMS Page</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" margin="normal" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField fullWidth label="Slug" margin="normal" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <TextField fullWidth label="Content (HTML)" multiline rows={8} margin="normal" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained" onClick={handleCreate}>Create</Button></DialogActions>
      </Dialog>
    </>
  );
};

export default AdminCMS;
