import { Command } from 'commander'
import { serve } from 'local-api'
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename))
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      )
      console.log(`
      Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file
      `)
    } catch (err: any) {
      if (err.code === 'EADDRINUSE') {
        console.log('port in use, try running on diff port')
      } else {
        console.log('Here is the error', err.message)
      }
      process.exit(1)
    }
  })
