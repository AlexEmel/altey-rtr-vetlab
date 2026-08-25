import { setIsPrinted } from '@/features/archive.slice';
import { getPdfString } from '@/features/result.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useParams } from 'react-router-dom';
import { GoBackButton } from '@/components/ui/buttons/GoBackButton/GoBackButton';
import { DownloadPdfBtn } from '@/components/ui/buttons/PdfBtns/DownloadBtn';
import { PrintPdfBtn } from '@/components/ui/buttons/PdfBtns/PrintPdfBtn';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './PdfPage.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PAGE_GAP: number = 16;

export const PdfPage = (): JSX.Element => {
  const { id } = useParams();
  const { storedPdf, isLoading } = useAppSelector((store) => store.results);
  const dispatch = useAppDispatch();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, numPages));

  useEffect(() => {
    if (id && storedPdf.orderId !== id) {
      dispatch(getPdfString(id));
      dispatch(setIsPrinted(id));
    }
  }, [dispatch, id, storedPdf.orderId]);

  useEffect(() => {
    if (storedPdf.pdf && storedPdf.orderId === id) {
      const nextPdfUrl = URL.createObjectURL(storedPdf.pdf);
      setPdfUrl(nextPdfUrl);

      return () => {
        URL.revokeObjectURL(nextPdfUrl);
      };
    }
  }, [id, storedPdf.pdf, storedPdf.orderId]);

  const onDocumentLoadSuccess = ({ numPages: totalPages }: { numPages: number }): void => {
    setNumPages(totalPages);
  };

  useEffect(() => {
    const handleScroll = () => {
      isUserScrolling.current = true;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 300);

      if (containerRef.current && numPages) {
        const scrollPosition = containerRef.current.scrollTop;
        const containerHeight = containerRef.current.clientHeight;
        const scrollHeight = containerRef.current.scrollHeight;
        const pageHeight = (scrollHeight - numPages * PAGE_GAP) / numPages;
        let currentPageInView = Math.floor((scrollPosition + PAGE_GAP) / pageHeight) + 1;

        if (scrollPosition + containerHeight >= scrollHeight) {
          currentPageInView = numPages;
        }

        setCurrentPage(currentPageInView);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [numPages]);

  useEffect(() => {
    if (!isUserScrolling.current) {
      const targetPage = pageRefs.current[currentPage - 1];
      if (targetPage && containerRef.current) {
        containerRef.current.scrollTo({
          top: targetPage.offsetTop - PAGE_GAP,
          behavior: 'smooth',
        });
      }
    }
  }, [currentPage]);

  const renderedPages = useMemo(
    () =>
      Array.from({ length: numPages }, (_, i) => (
        <div key={i} ref={(el) => (pageRefs.current[i] = el)} className={styles.pdfPage}>
          <Page
            key={i}
            pageNumber={i + 1}
            renderAnnotationLayer={false}
            className={styles.pdfPage}
            scale={0.75}
            width={window.innerWidth * 0.9}
          />
        </div>
      )),
    [numPages],
  );

  return isLoading ? (
    <Spinner />
  ) : (
    <Flex className={styles.container}>
      <Flex className={styles.goBackBox}>
        <GoBackButton />
      </Flex>
      {pdfUrl && (
        <Flex className={styles.controls}>
          <Flex className={styles.controlGroup}>
            <Button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              icon={<DoubleLeftOutlined />}
              size="middle"
            >
              Пред
            </Button>
            <Flex className={styles.pageTracker}>
              <span>{`${currentPage} / ${numPages || ''}`}</span>
            </Flex>
            <Button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              icon={<DoubleRightOutlined />}
              size="middle"
            >
              След
            </Button>
          </Flex>
          <Flex className={styles.controlGroup}>
            <DownloadPdfBtn url={pdfUrl} id={id} />
            <PrintPdfBtn url={pdfUrl} />
          </Flex>
        </Flex>
      )}
      <Flex ref={containerRef} className={styles.documentWrapper}>
        <Document
          file={pdfUrl}
          loading={<Spinner />}
          onLoadSuccess={onDocumentLoadSuccess}
          className={styles.document}
        >
          {renderedPages}
        </Document>
      </Flex>
    </Flex>
  );
};
