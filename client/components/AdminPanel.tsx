import styled from "styled-components";
import tw from "tailwind.macro";

import AdminQuestions from "./AdminQuestions";

const AdminWrapper = styled.div`
  ${tw`h-full w-full`}
`;

const AdminHeader = styled.header`
  ${tw`p-4 border-b border-gray-300`}
`;

const AdminContent = styled.div`
  ${tw`p-4`}
`;

function AdminPanel() {
  return (
    <AdminWrapper>
      <AdminHeader>
        <h1>DSM - Admin</h1>
      </AdminHeader>
      <AdminContent>
        <AdminQuestions />
      </AdminContent>
    </AdminWrapper>
  );
}

export default AdminPanel;
