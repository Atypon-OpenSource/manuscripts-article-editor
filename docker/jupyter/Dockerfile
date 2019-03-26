FROM jupyter/datascience-notebook

RUN python --version

USER root

#RUN pip install -U plotly

RUN R --slave -e "install.packages('Rmisc', repos='http://cran.us.r-project.org')"
RUN R --slave -e "install.packages('cowplot', repos='http://cran.us.r-project.org')"

USER $NB_UID
