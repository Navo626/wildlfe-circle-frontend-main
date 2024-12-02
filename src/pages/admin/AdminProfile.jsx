import Breadcrumb from "../../components/Miscellaneous/Breadcrumb.jsx";
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import ProfileUpdate from "../../components/Layouts/ProfileUpdate.jsx";

const breadcrumbData = [{ text: "Profile", current: true }];

const AdminProfile = () => {
  return (
    <>
      <DashboardLayout>
        <div className="p-4 min-h-screen">
          <Breadcrumb breadcrumbs={breadcrumbData} />

          <ProfileUpdate role="admin" onClose={() => {}} />
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminProfile;
