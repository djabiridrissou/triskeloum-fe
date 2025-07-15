// src/pages/Unauthorized.tsx
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403 - Accès non autorisé"
      subTitle="Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      }
    />
  );
};

export default Unauthorized;