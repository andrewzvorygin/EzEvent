import React, { FC, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../App";
import { DeviceType } from "../../types";
import { eventsAPI } from "../../api/Api";

interface InvitePropsType {
  auth: boolean;
  initialized: boolean;
}

const Invite: FC<InvitePropsType> = ({ auth, initialized }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const eventId = useParams().eventId;
  const key = useParams().key;

  useEffect(() => {
    if (initialized && !auth) {
      navigate("/auth", { state: location });
      return;
    }
    eventId &&
      key &&
      eventsAPI.addOrganizers(eventId, key).then((res) => {
        if (res.ok) {
          navigate(`/event/${eventId}/edit`, { replace: true });
        }
      });
  }, [auth, initialized]);

  return null;
};

const InvitePage = () => {
  return (
    <AuthContext.Consumer>
      {({ auth, initialized }) => (
        <Invite auth={auth} initialized={initialized} />
      )}
    </AuthContext.Consumer>
  );
};

export default InvitePage;
