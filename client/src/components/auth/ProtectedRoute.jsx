import Layout from '../Layout';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return user ? (
        <Layout>
            <Outlet />
        </Layout>
    ) : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
