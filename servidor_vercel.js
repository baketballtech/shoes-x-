import express from "express";
import cors from "cors";
import helmet from "helmet";
import pkg from "pg"; // Importando o pacote pg como um módulo padrão
const { Client } = pkg; // Desestruturando Client do pacote

const app = express();
//codigo 3
// Configuração do middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());

// Conexão com o banco de dados PostgreSQL (Neon)
const client = new Client({
  connectionString: "postgresql://shoes_x_owner:npg_wGSQCAXHs51c@ep-delicate-truth-a59lql4p-pooler.us-east-2.aws.neon.tech/shoes_x?sslmode=require",
  ssl: {
    rejectUnauthorized: false, // Para evitar problemas de SSL com o Neon
  },
});

// Tentativa de conexão com o banco de dados
client.connect()
  .then(() => console.log("Banco de dados conectado com sucesso!"))
  .catch(err => {
    console.error("Erro ao conectar no banco:", err);
    process.exit(1);  // Força o aplicativo a parar caso a conexão falhe
  });

// Rota para pegar os dados
app.get("/pegar", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM sapatos WHERE loja IS NOT NULL AND loja <> '' AND tipo = 'loja' ORDER BY CASE WHEN marca = 'Nike' THEN 1 WHEN marca = 'Adidas' THEN 2 WHEN marca = 'Puma' THEN 3 WHEN marca = 'Gucci' THEN 4 WHEN marca = 'Louis Vuitton' THEN 5 ELSE 6 END, marca"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ erro: "Erro ao buscar dados" });
  }
});

// Exposição para o Vercel
export default app;
