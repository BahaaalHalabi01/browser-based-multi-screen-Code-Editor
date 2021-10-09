import express from 'express'
import fs from 'fs/promises'
import path from 'path'

interface Cell {
  id: string
  data: string
  type: 'text' | 'code'
}

export const createCellsRouter = (filename: string, dirname: string) => {
  const router = express.Router()
  router.use(express.json())

  const fullPath = path.join(dirname, filename)

  router.get('/cells', async (req, res) => {
    //read file
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' })

      res.send(JSON.parse(result))
    } catch (error: any) {
      // if read throws an error
      // see the error, if file doesnt exist
      //create it

      if (error.code === 'ENOENT') {
        // create file and default cells
        await fs.writeFile(fullPath, '[]', 'utf-8')
        res.send([])
      } else {
        throw error
      }
    }

    //parse a list of file out of it
    //send it back to browser
  })

  router.post('/cells', async (req, res) => {
    //take the list of cells from the req object
    // turn them into formate to be written into a file
    const cells: Cell[] = req.body

    //write to file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8')

    res.send({ status: 'Okay' })
  })

  return router
}
