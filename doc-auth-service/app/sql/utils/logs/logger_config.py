import logging

logging.basicConfig(
    level=logging.DEBUG,  # Set the logging level to DEBUG for maximum output
    format="%(asctime)s [%(levelname)s] - %(message)s",
    handlers=[logging.StreamHandler()],  # Display log messages in the console
)

logger = logging.getLogger(__name__)
