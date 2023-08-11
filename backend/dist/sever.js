import express from 'express';
import { stuff } from './h.js';
const app = express();
const PORT = 5000;
app.get('/', (req, res) => {
    res.send('Hello Express with TypeScript! ' + stuff);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=sever.js.map