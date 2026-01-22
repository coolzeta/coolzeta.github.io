'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Box, Dialog, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

// Configure mermaid with better default styling
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  logLevel: 'error',
  fontFamily: 'monospace',
  themeVariables: {
    // Node colors
    primaryColor: '#326de6',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#1a56d6',
    // Line colors
    lineColor: '#666666',
    // Background colors
    mainBkg: '#1a1a1a',
    // Text colors
    textColor: '#ffffff',
    // Special node colors
    errorBkgColor: '#ff4444',
    errorTextColor: '#ffffff',
    // Additional colors for better visibility
    nodeBorder: '#326de6',
    clusterBkg: '#2a2a2a',
    clusterBorder: '#326de6',
    labelBoxBkgColor: '#2a2a2a',
    labelBoxBorderColor: '#326de6',
    labelTextColor: '#ffffff',
    loopTextColor: '#ffffff',
    sectionBkgColor: '#2a2a2a',
    sectionBkgColor2: '#1a1a1a',
    sectionBkgColor3: '#2a2a2a',
    sectionBkgColor4: '#1a1a1a',
    sectionBkgColor5: '#2a2a2a',
    sectionBkgColor6: '#1a1a1a',
    sectionBkgColor7: '#2a2a2a',
    sectionBkgColor8: '#1a1a1a',
    sectionBkgColor9: '#2a2a2a',
    sectionBkgColor10: '#1a1a1a',
  },
  flowchart: {
    curve: 'basis',
    nodeSpacing: 50,
    rankSpacing: 50,
    useMaxWidth: true,
    htmlLabels: true,
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    mirrorActors: true,
    bottomMarginAdj: 1,
    useMaxWidth: true,
  },
});

interface MermaidProps {
  chart: string;
  id: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, id }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1.5);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const initMermaid = async () => {
      if (elementRef.current) {
        try {
          // Update theme variables based on color scheme
          mermaid.initialize({
            theme: 'dark',
            securityLevel: 'loose',
            startOnLoad: false,
            logLevel: 'error',
            themeVariables: {
              primaryColor: '#326de6',
              primaryTextColor: '#ffffff',
              primaryBorderColor: '#1a56d6',
              lineColor: '#666666',
              mainBkg: '#1a1a1a',
              textColor: '#ffffff',
              nodeBorder: '#326de6',
              clusterBkg: '#2a2a2a',
              clusterBorder: '#326de6',
              labelBoxBkgColor: '#2a2a2a',
              labelBoxBorderColor: '#326de6',
              labelTextColor: '#ffffff',
              loopTextColor: '#ffffff',
              sectionBkgColor: '#2a2a2a',
              sectionBkgColor2: '#1a1a1a',
              sectionBkgColor3: '#2a2a2a',
              sectionBkgColor4: '#1a1a1a',
              sectionBkgColor5: '#2a2a2a',
              sectionBkgColor6: '#1a1a1a',
              sectionBkgColor7: '#2a2a2a',
              sectionBkgColor8: '#1a1a1a',
              sectionBkgColor9: '#2a2a2a',
              sectionBkgColor10: '#1a1a1a',
            },
          });

          console.log('Rendering mermaid chart:', chart.substring(0, 100));

          // 使用 mermaid.render 而不是 mermaid.run
          const uniqueId = `mermaid-${id}-${Date.now()}`;
          const { svg } = await mermaid.render(uniqueId, chart);

          if (elementRef.current) {
            elementRef.current.innerHTML = svg;
            setSvgContent(svg);
            console.log('Mermaid chart rendered successfully');
          }
        } catch (error) {
          console.error('Failed to render mermaid chart:', error);
          console.error('Chart content:', chart);

          // 获取详细的错误信息
          let errorMessage = 'Unknown error';
          let errorDetails = '';

          if (error instanceof Error) {
            errorMessage = error.message;
            errorDetails = error.stack || '';
          } else if (typeof error === 'object' && error !== null) {
            errorMessage = JSON.stringify(error, null, 2);
          } else {
            errorMessage = String(error);
          }

          // 显示错误信息
          if (elementRef.current) {
            elementRef.current.innerHTML = `<div style="color: #ff6b6b; padding: 20px; background: rgba(255,107,107,0.1); border-radius: 8px; border: 2px solid #ff6b6b;">
              <strong style="font-size: 16px;">⚠️ Mermaid 渲染失败</strong><br/><br/>
              <strong>错误信息:</strong><br/>
              <div style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 4px; font-family: monospace; font-size: 13px; white-space: pre-wrap;">${errorMessage}</div>
              ${
                errorDetails
                  ? `<details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: #ffd43b;">查看详细堆栈</summary>
                <pre style="margin-top: 10px; font-size: 11px; overflow: auto;">${errorDetails}</pre>
              </details>`
                  : ''
              }
              <details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: #ffd43b;">查看图表代码</summary>
                <pre style="margin-top: 10px; font-size: 12px; overflow: auto; max-height: 300px;">${chart}</pre>
              </details>
              <div style="margin-top: 15px; padding: 10px; background: rgba(255,215,0,0.1); border-left: 3px solid #ffd43b; font-size: 12px;">
                <strong>💡 常见问题：</strong><br/>
                • 节点标签换行必须使用 &lt;br/&gt; 而不是普通换行<br/>
                • 例如：<code>Node[第一行&lt;br/&gt;第二行]</code>
              </div>
            </div>`;
          }
        }
      }
    };

    initMermaid();
  }, [chart, id]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setScale(1.5);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.5);
  };

  return (
    <>
      <div className="mermaid-wrapper my-8">
        <Box
          sx={{
            bgcolor: 'background.paper',
            minWidth: '100%',
            m: 0,
            p: 2,
            borderRadius: 2,
            position: 'relative',
            '& p': {
              color: 'text.primary',
            },
            '& .mermaid': {
              display: 'flex',
              justifyContent: 'center',
              '& svg': {
                maxWidth: '100%',
                height: 'auto',
              },
            },
            '&:hover .zoom-button': {
              opacity: 1,
            },
          }}
        >
          {/* 放大按钮 */}
          <Tooltip title="点击放大查看">
            <IconButton
              className="zoom-button"
              onClick={handleOpen}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                opacity: 0,
                transition: 'opacity 0.3s',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <ZoomInIcon />
            </IconButton>
          </Tooltip>

          <div
            className={`mermaid-${id}`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'flex',
              alignSelf: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            ref={elementRef}
            onClick={handleOpen}
          >
            {chart}
          </div>
        </Box>
      </div>

      {/* 全屏对话框 */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            maxHeight: '95vh',
            maxWidth: '95vw',
            m: 2,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            p: 4,
            overflow: 'auto',
            bgcolor: '#1a1a1a',
            minHeight: '50vh',
          }}
        >
          {/* 工具栏 */}
          <Box
            sx={{
              position: 'fixed',
              top: 24,
              right: 24,
              zIndex: 1400,
              display: 'flex',
              gap: 1,
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: 1,
              p: 0.5,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Tooltip title="放大">
              <IconButton
                onClick={handleZoomIn}
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="缩小">
              <IconButton
                onClick={handleZoomOut}
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="重置缩放">
              <IconButton
                onClick={handleResetZoom}
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ZoomInMapIcon />
              </IconButton>
            </Tooltip>
            <Box sx={{ width: '1px', bgcolor: 'rgba(255, 255, 255, 0.2)', mx: 0.5 }} />
            <Tooltip title="关闭">
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Mermaid 图表（使用 transform 放大原始元素） */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              minHeight: '400px',
              pt: 6,
              width: '100%',
              overflowX: 'auto',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                transition: 'transform 0.3s ease-out',
                minWidth: 'max-content',
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: svgContent,
                }}
                style={{
                  display: 'inline-block',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Mermaid;
