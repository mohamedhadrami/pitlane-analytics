import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#222',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    borderRadius: '5px',
  },
}));

export default HtmlTooltip;