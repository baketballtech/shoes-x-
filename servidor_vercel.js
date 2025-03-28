import { Client } from "pg";
import Cors from "cors";
import helmet from "helmet";

// Habilitar CORS
const cors = Cors({
  methods: ["GET", "HEAD"],
  origin: "*", // Adapte conforme necessário para a política de CORS
});

// Conexão com o banco de dados PostgreSQL (Neon)
const client = new Client({
  connectionString: "postgresql://shoes_x_owner:npg_wGSQCAXHs51c@ep-delicate-truth-a59lql4p-pooler.us-east-2.aws.neon.tech/shoes_x?sslmode=require",
  ssl: {
    rejectUnauthorized: false, // Para evitar problemas de SSL com o Neon
  },
});

// A conexão com o banco será reutilizada entre as invocações da função
if (!client._connected) {
  client.connect()
    .then(() => console.log("Banco de dados conectado com sucesso!"))
    .catch(err => console.error("Erro ao conectar no banco:", err));
}

export default async function handler(req, res) {
  // Usar CORS para manipular a requisição
  await new Promise((resolve, reject) => cors(req, res, (result) => result instanceof Error ? reject(result) : resolve(result)));

  // Usar Helmet para segurança de cabeçalhos
  helmet()(req, res);

  // Verificar se o método da requisição é GET
  if (req.method === "GET") {
    try {
      const result = await client.query(
        "SELECT * FROM sapatos ORDER BY CASE WHEN marca = 'Nike' THEN 1 WHEN marca = 'Adidas' THEN 2 WHEN marca = 'Puma' THEN 3 when marca='Gucci' then 4 when marca='Louis Vuitton' then 5 ELSE 6 END, marca;"
      );
      res.status(200).json(result.rows); // Retorna os dados do banco
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      res.status(500).json({ erro: "Erro ao buscar dados" });
    }
  } else {
    // Retorna erro caso o método não seja GET
    res.status(405).json({ erro: "Método não permitido" });
  }
}
