import React, { useEffect, useState } from "react";
import { Alert, Box, Input, Stack, Typography } from "@mui/material";
import {
  ControlPointOutlined,
  ContentCopyOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import Modal from "@mui/material/Modal";

import {
  StyledButton,
  StyledIconButton,
} from "../StyledControls/StyledControls";
import { ProfileNameType } from "../../types";
import { eventsAPI } from "../../api/Api";

interface OrganizersPropsType {
  eventId: string;
  editors: ProfileNameType[];
}

const Organizers: React.FC<OrganizersPropsType> = ({ editors, eventId }) => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const [mainEditor, ...otherEditor] = editors;

  const getKeyInvite = (eventId: string) => {
    eventsAPI
      .getOrganizersKeyInvite(eventId, (response) => {
        if (response.status === 403) {
          setError("Действие доступно только ответственному за мероприятие");
        }
      })
      .then((data) => {
        setLink(`http://localhost:3000/event/${eventId}/invite/${data.key}`);
      });
  };

  useEffect(() => {
    if (open) {
      getKeyInvite(eventId);
    }
  }, [open, eventId]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: "1em",
          alignItems: "center",
        }}
        mb={3}
      >
        <Typography variant="h3">Добавить организатора</Typography>
        <StyledIconButton onClick={() => setOpen(true)}>
          <ControlPointOutlined fontSize="large" />
        </StyledIconButton>
      </Box>
      <Stack mb={3} gap={1.5} alignItems="start">
        <Typography>Главный организатор</Typography>
        <StyledButton variant="outlined">
          {mainEditor.name} {mainEditor.surname}
        </StyledButton>
      </Stack>
      {otherEditor.length > 0 && (
        <Stack alignItems="start" gap={1.5}>
          <Typography>Список организаторов:</Typography>
          {otherEditor.map((editor, index) => (
            <StyledButton key={index} variant="outlined">
              {editor.name} {editor.surname}
            </StyledButton>
          ))}
        </Stack>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Добавить организатора
          </Typography>
          {error ? (
            <Typography>{error}</Typography>
          ) : (
            <>
              {copied && (
                <Alert severity="success" color="info">
                  Скопировано
                </Alert>
              )}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Input value={link} fullWidth />
                <StyledIconButton
                  onClick={() => {
                    setCopied(false);
                    navigator.clipboard
                      .writeText(link)
                      .then(() => setCopied(true));
                  }}
                >
                  <ContentCopyOutlined fontSize="small" />
                </StyledIconButton>
                <StyledIconButton
                  onClick={async () => {
                    setCopied(false);
                    await eventsAPI.putOrganizersKeyInvite(eventId);
                    getKeyInvite(eventId);
                  }}
                >
                  <RefreshOutlined fontSize="small" />
                </StyledIconButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Organizers;
