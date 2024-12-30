import { LinearProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'

function NotFound() {
    const [progress, setProgress] = useState(0);
  const [contexLoading, setcontexLoading] = useState(false)

    useEffect(() => {
        const customLoading=async()=>{
            setcontexLoading(true)
            const totalSteps = 10; 
            for (let step = 0; step <= totalSteps; step++) {
              setProgress((step / totalSteps) * 100);
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            setTimeout(() => {
              {
                setProgress(100);
                setcontexLoading(false);
              }
            }, 500);
          }
          customLoading()
    }, [])
  return (
    <div>
        {contexLoading ? <LinearProgress sx={{color:"#1862AD"}} size="sm" variant="determinate" value={progress} />:
        <div>not found
            </div>
        }
    </div>
  )
}

export default NotFound