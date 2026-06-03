import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Switch } from '@mui/material';
import { toast } from 'react-toastify';
import { userAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const load = () => userAPI.getAll().then(({ data }) => setUsers(data.data.users));

  useEffect(() => { load(); }, []);

  const toggleStatus = async (id, isActive) => {
    await userAPI.updateStatus(id, isActive);
    toast.success('User status updated');
    load();
  };

  return (
    <>
      <PageHeader title="User Management" />
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Active</TableCell></TableRow></TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Chip label={u.role} size="small" /></TableCell>
                <TableCell><Switch checked={u.isActive} onChange={(e) => toggleStatus(u._id, e.target.checked)} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default AdminUsers;
