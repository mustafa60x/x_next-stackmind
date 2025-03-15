import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';

const UserProfile: React.FC = () => {
  const { currentUser, loadUser } = useUser();

  useEffect(() => {
    loadUser('123');
  }, [loadUser]);

  if (!currentUser) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h1>{currentUser.name}</h1>
      <p>{currentUser.email}</p>
    </div>
  );
};

export default UserProfile;
