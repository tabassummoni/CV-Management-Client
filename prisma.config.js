import { defineConfig } from 'prisma';
import { API_BASE_URL } from './src/config/api.jsx';
export default defineConfig({
  datasource: {
   
    url: process.env.DATABASE_URL, 
  },
});
