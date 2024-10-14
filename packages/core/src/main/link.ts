import { chalk, getDirBasePath } from '../utils/index.js'
import fs from 'fs-extra'
import path from 'path'
import HLinkError, { ErrorCode } from '../core/HlinkError.js'

const errorSuggestion: Record<string, ErrorCode> = {
  EXDEV: ErrorCode.CrossDeviceLink,
  EPERM: ErrorCode.NotPermitted,
  EEXIST: ErrorCode.FileExists,
}

/**
 *
 * @param sourceFile 源文件的绝对路径
 * @param originalDestPath 硬链文件实际存放的目录(绝对路径)
 */

async function link(
  sourceFile: string,
  originalDestPath: string,
  source: string,
  dest: string
) {
  // 做硬链接
  try {
    await fs.ensureDir(originalDestPath)
    await fs.link(
      sourceFile,
      path.join(originalDestPath, path.basename(sourceFile))
    )
  } catch (e) {
    if (e instanceof Error) {
      const error = e as NodeJS.ErrnoException
      if (error.code && error.code in errorSuggestion) {
        const errorCode =
          errorSuggestion[error.code as keyof typeof errorSuggestion]
        throw new HLinkError(
          errorCode,
          `${chalk.gray(getDirBasePath(source, sourceFile))} ${chalk.cyan(
            '>'
          )} ${getDirBasePath(
            dest,
            path.join(originalDestPath, path.basename(sourceFile))
          )}`
        )
      } else {
        throw e
      }
    } else {
      throw e
    }
  }
}

export default link
