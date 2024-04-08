import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Link,
  } from '@mui/material'
  import Notification from "./Notification";


const Users= ({ users, message }) => (
    <div>
      <h2>Users</h2>

      <Notification message={message} />

  
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>
                  {user.blogs.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

export default Users